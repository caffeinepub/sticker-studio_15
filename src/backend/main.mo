import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

import Stripe "stripe/stripe";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize storage for blobs (images, ZIP files)
  include MixinStorage();

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Stripe Integration Configuration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Sticker Pack Types and State
  public type StickerPack = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    categoryTags : [Text];
    previewImageBlobId : Storage.ExternalBlob; // image reference
    zipFileBlobId : Storage.ExternalBlob; // ZIP file download reference
  };

  let stickerPacks = Map.empty<Text, StickerPack>();
  var nextStickerPackId = 0;

  // Order Types and State
  public type Order = {
    id : Text;
    user : Principal;
    stickerPackId : Text;
    isPaid : Bool;
    stripeSessionId : ?Text;
  };

  let orders = Map.empty<Text, Order>();
  var nextOrderId = 0;

  // Contact Form Types and State
  public type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    message : Text;
  };

  let contactMessages = Map.empty<Text, ContactMessage>();
  var nextContactId = 0;

  // Stripe Functions
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe config must be set first") };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Sticker Pack Catalog Management

  public query ({ caller }) func listAllStickerPacks() : async [StickerPack] {
    stickerPacks.values().toArray();
  };

  public query ({ caller }) func getStickerPackById(id : Text) : async ?StickerPack {
    stickerPacks.get(id);
  };

  public shared ({ caller }) func addOrUpdateStickerPack(pack : StickerPack) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage packs");
    };
    let packId = if (pack.id == "") {
      let newId = "pack-" # nextStickerPackId.toText();
      nextStickerPackId += 1;
      newId;
    } else {
      pack.id;
    };
    let newPack : StickerPack = {
      id = packId;
      name = pack.name;
      description = pack.description;
      priceCents = pack.priceCents;
      categoryTags = pack.categoryTags;
      previewImageBlobId = pack.previewImageBlobId;
      zipFileBlobId = pack.zipFileBlobId;
    };
    stickerPacks.add(packId, newPack);
  };

  public shared ({ caller }) func removeStickerPack(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove packs");
    };
    stickerPacks.remove(id);
  };

  // Order Management

  public shared ({ caller }) func createOrder(stickerPackId : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    switch (stickerPacks.get(stickerPackId)) {
      case (null) { Runtime.trap("Sticker pack does not exist") };
      case (?_) {
        let newOrderId = "order-" # nextOrderId.toText();
        nextOrderId += 1;
        let newOrder : Order = {
          id = newOrderId;
          user = caller;
          stickerPackId;
          isPaid = false; // Default to unpaid
          stripeSessionId = null;
        };
        orders.add(newOrderId, newOrder);
        newOrderId;
      };
    };
  };

  public shared ({ caller }) func markOrderAsPaid(orderId : Text, sessionId : Text) : async () {
    // Allow admins to manually mark orders as paid
    // In production, this would also need to verify Stripe webhook signatures
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can mark orders as paid");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          user = order.user;
          stickerPackId = order.stickerPackId;
          isPaid = true;
          stripeSessionId = ?sessionId;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrderDownloadLink(orderId : Text) : async ?Storage.ExternalBlob {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.user != caller) {
          Runtime.trap("Unauthorized: Can only download your own orders");
        };
        if (not order.isPaid) {
          Runtime.trap("Order must be paid to download files");
        };
        switch (stickerPacks.get(order.stickerPackId)) {
          case (null) { null };
          case (?pack) { ?pack.zipFileBlobId };
        };
      };
    };
  };

  public query ({ caller }) func listUserOrders(user : Principal) : async [Order] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    // Filter orders to only return orders for the requested user
    let userOrders = orders.values().toArray().filter(
      func(order) {
        order.user == user;
      }
    );
    userOrders;
  };

  // Contact Form

  public shared ({ caller }) func submitContactMessage(name : Text, email : Text, message : Text) : async Text {
    // Public endpoint - guests can submit contact messages
    let newId = "contact-" # nextContactId.toText();
    nextContactId += 1;
    let newMessage : ContactMessage = {
      id = newId;
      name;
      email;
      message;
    };
    contactMessages.add(newId, newMessage);
    newId;
  };

  public query ({ caller }) func listContactMessages() : async [ContactMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };
};
