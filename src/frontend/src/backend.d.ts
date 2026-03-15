import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Order {
    id: string;
    user: Principal;
    isPaid: boolean;
    stickerPackId: string;
    stripeSessionId?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface StickerPack {
    id: string;
    zipFileBlobId: ExternalBlob;
    categoryTags: Array<string>;
    name: string;
    description: string;
    previewImageBlobId: ExternalBlob;
    priceCents: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateStickerPack(pack: StickerPack): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(stickerPackId: string): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getOrderDownloadLink(orderId: string): Promise<ExternalBlob | null>;
    getStickerPackById(id: string): Promise<StickerPack | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listAllStickerPacks(): Promise<Array<StickerPack>>;
    listContactMessages(): Promise<Array<ContactMessage>>;
    listUserOrders(user: Principal): Promise<Array<Order>>;
    markOrderAsPaid(orderId: string, sessionId: string): Promise<void>;
    removeStickerPack(id: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
