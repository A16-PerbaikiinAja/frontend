'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Users2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [technician, setTechnician] = useState<{
    id: string;
    name: string;
    imageUrl?: string;
    rating?: number;
    totalReviews?: number;
  } | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchReview = async () => {
      setLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/${id}`;
        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch review');
        const data = await res.json();
        setComment(data.comment);
        setRating(Number(data.rating) || 0);

        setTechnician({
          id: data.technicianId,
          name: data.technicianFullName,
          rating: undefined,
          totalReviews: undefined,
        });
      } catch {
        setError('Failed to load review!');
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!rating) {
      setError('Please provide a rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login again.');
      const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/${id}`;
      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, rating }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Failed updating review');
      }
      toast.success('Review updated!');
      router.push('/dashboard/reviews');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      toast.error('Failed to update review.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          aria-label={`Rate ${star} star`}
          key={star}
          disabled={submitting}
          className="focus:outline-none"
          onClick={() => setRating(star)}>
          <Star
            className={`h-7 w-7 transition ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <motion.div
        className="w-full max-w-2xl px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        <div className="mb-8 flex items-center">
          <Link
            href="/dashboard/reviews"
            className="text-primary hover:text-primary/90 mr-4 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Reviews</span>
          </Link>
        </div>
        <Card className="border-border bg-card rounded-lg border shadow-sm">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <Users2 className="text-primary h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Edit Review</CardTitle>
            <p className="text-muted-foreground mt-2 max-w-md text-sm">
              Update your rating and comment for this technician.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground py-8 text-center">Loading data…</div>
            ) : technician ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="mb-2 block font-semibold">Technician</Label>
                  <div className="bg-muted/50 pointer-events-none flex items-center gap-3 rounded border px-3 py-2 opacity-90">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={technician.imageUrl} alt={technician.name} />
                      <AvatarFallback>{technician.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{technician.name}</span>
                        {technician.rating !== undefined && (
                          <>
                            <span className="text-xs text-yellow-500">
                              ★{(technician.rating ?? 0).toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              ({technician.totalReviews ?? 0})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block font-semibold">Rating</Label>
                  <StarRating />
                </div>
                <div>
                  <Label className="mb-2 block font-semibold">Comment/Feedback</Label>
                  <Textarea
                    disabled={submitting}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] w-full rounded border p-2"
                    placeholder="Tell your experience…"
                    required
                  />
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!rating || !comment || submitting}>
                    {submitting ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center text-red-600">Review not found.</div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
