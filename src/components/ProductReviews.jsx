// @ts-nocheck
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, ChevronLeft, Loader2, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { setProductRating } from "@/lib/custom-products";

function Stars({ value, size = "size-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star className={`size-6 ${n <= shown ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, onClose }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, user_id, rating, title, body, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Couldn't load reviews.");
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [productId]);

  const mine = user ? rows.find((r) => r.user_id === user.id) : null;
  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setTitle(mine.title ?? "");
      setBody(mine.body ?? "");
    }
  }, [mine?.id]);

  const avg = rows.length
    ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10
    : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!rating) { toast.error("Pick a star rating."); return; }
    setSaving(true);
    const payload = {
      product_id: productId,
      user_id: user.id,
      rating,
      title: title.trim() || null,
      body: body.trim() || null,
    };
    const { error } = await supabase
      .from("product_reviews")
      .upsert(payload, { onConflict: "product_id,user_id" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mine ? "Review updated." : "Thanks for your review!");
    await load();
  };

  const remove = async () => {
    if (!mine) return;
    setSaving(true);
    const { error } = await supabase.from("product_reviews").delete().eq("id", mine.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setTitle(""); setBody(""); setRating(5);
    toast.success("Your review was deleted.");
    await load();
  };

  return (
    <div className="neo rounded-2xl bg-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="neo-sm inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="size-3.5" />
          Back to piece
        </button>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Reviews</div>
          <div className="flex items-center gap-2 justify-end mt-1">
            <Stars value={Math.round(avg)} />
            <span className="text-sm text-muted-foreground">
              {avg || "—"} · {rows.length}
            </span>
          </div>
        </div>
      </div>

      {user ? (
        <form onSubmit={submit} className="neo-inset rounded-xl p-4 mb-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
            {mine ? "Your review" : "Leave a review"}
          </div>
          <StarPicker value={rating} onChange={setRating} />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            maxLength={80}
            className="mt-3 w-full bg-transparent border-b border-border/50 focus:border-primary outline-none py-2 text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience with this piece…"
            maxLength={800}
            rows={3}
            className="mt-2 w-full bg-transparent border border-border/40 rounded-lg p-2 text-sm outline-none focus:border-primary resize-none"
          />
          <div className="mt-3 flex items-center gap-2 justify-end">
            {mine && (
              <button
                type="button"
                onClick={remove}
                disabled={saving}
                className="neo-sm px-3 py-2 text-[11px] uppercase tracking-widest text-destructive inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="btn-gold px-4 py-2 text-[11px] uppercase tracking-widest font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
              {mine ? "Update review" : "Post review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="neo-inset rounded-xl p-4 mb-5 text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary underline underline-offset-2">Sign in</Link>{" "}
          to leave a review.
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {loading ? (
          <div className="text-sm text-muted-foreground text-center py-6">
            <Loader2 className="size-4 animate-spin inline mr-2" /> Loading reviews…
          </div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6">
            No reviews yet — be the first.
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="neo-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Stars value={r.rating} size="size-3.5" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.title && <div className="text-sm font-semibold mt-2">{r.title}</div>}
              {r.body && <p className="text-sm text-foreground/80 mt-1 leading-relaxed whitespace-pre-wrap">{r.body}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
