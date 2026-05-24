export default function Newsletter() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 className="font-display text-4xl md:text-5xl mb-4">
        Whispers from <span className="italic text-gold-gradient">the Souq</span>
      </h2>
      <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
        New collections, private viewings, and stories from our master artisans —
        delivered with care, never spam.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="neo-inset p-2 rounded-full flex items-center gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        <button className="neo-pressable px-6 py-3 text-xs uppercase tracking-widest text-primary">
          Subscribe
        </button>
      </form>
    </section>
  );
}
