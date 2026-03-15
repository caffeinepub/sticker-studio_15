import { motion } from "motion/react";

const values = [
  {
    emoji: "🎨",
    title: "Hand-crafted with love",
    desc: "Every sticker is carefully illustrated by real artists who pour their heart into each tiny detail.",
  },
  {
    emoji: "✨",
    title: "Kawaii for everyone",
    desc: "Whether you're a bullet journaler, student, or laptop decorator — there's a pack made just for you.",
  },
  {
    emoji: "🌍",
    title: "Global community",
    desc: "Our stickers have reached over 50 countries. Digital art knows no borders!",
  },
  {
    emoji: "💕",
    title: "Spreading joy",
    desc: "We believe a cute sticker can brighten your day. That's our entire mission.",
  },
];

const team = [
  {
    name: "Mia",
    role: "Founder & Lead Artist",
    emoji: "🌸",
    bio: "Mia started StickerDrop in her dorm room, drawing stickers between study sessions. Now she leads a team of talented artists.",
  },
  {
    name: "Yuki",
    role: "Illustrator & Designer",
    emoji: "🦋",
    bio: "Yuki specializes in nature and animal-themed illustrations. Her Garden Friends pack is a perennial bestseller.",
  },
  {
    name: "Sora",
    role: "Community Manager",
    emoji: "⭐",
    bio: "Sora keeps our community thriving and makes sure every customer gets the adorable experience they deserve.",
  },
];

export function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="pastel-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-5xl mb-4">🌸✨💕</p>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              The Story Behind StickerDrop
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              We're a small team of illustrators obsessed with cute things, good
              stationery, and making your digital life a little more magical.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 border border-border shadow-soft"
          >
            <p className="text-3xl mb-4">📖</p>
            <h2 className="font-display font-bold text-2xl mb-4">
              How it all started
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                It started with a planner. Mia was looking for cute digital
                stickers to use in her GoodNotes journal but couldn't find
                anything that matched her aesthetic. So she did what any
                frustrated art student would do — she made her own.
              </p>
              <p>
                After sharing them with a few friends who immediately asked for
                more, StickerDrop was born. What started as a hobby project in
                2022 has grown into a collection of thousands of stickers loved
                by planners worldwide.
              </p>
              <p>
                Today, StickerDrop ships (digitally!) to over 50 countries.
                Every pack is still made with the same love and attention to
                detail as that very first set.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="font-display font-black text-3xl text-center mb-10">
          What We Believe In 💕
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-3xl p-6 border border-border"
            >
              <p className="text-3xl mb-3">{v.emoji}</p>
              <h3 className="font-display font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-black text-3xl text-center mb-10">
            Meet the Team ✨
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-card rounded-3xl p-6 border border-border text-center"
              >
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="font-display font-bold text-lg">
                  {member.name}
                </h3>
                <p className="text-xs text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
