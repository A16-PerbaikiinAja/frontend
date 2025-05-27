'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  userId: string;
  technicianId: string;
  technicianFullName: string;
  comment: string;
  rating: number;
  createdAt: string;
  owner: boolean;
}

const ReviewsPage: React.FC = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth?.() || { user: null };
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewApiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review`;

      const token = localStorage.getItem('token');

      const requestOptions = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };

      const response = await fetch(reviewApiUrl, requestOptions);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Review[] = await response.json();
      setReviews(data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    setDeletingIds((prev) => [...prev, id]);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/${id}`;

      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed deleting review');

      setReviews((prev) => prev.filter((review) => review.id !== id));
      toast.success('Review deleted!');
    } catch (err: any) {
      toast.error('Failed deleting review');
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const goToEdit = (id: string) => {
    router.push(`/dashboard/reviews/edit/${id}`);
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`mr-1 h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          fill={i < rating ? '#FACC15' : '#E5E7EB'}
        />
      ))}
    </div>
  );

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="mt-6 flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading Reviews...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-6 flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-xl text-red-500">❌</div>
            <p className="font-medium text-red-600">Loading Reviews Failed!</p>
            <button
              onClick={fetchReviews}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">📝</div>
          <h3 className="mb-2 text-xl font-medium text-gray-900">There's no reviews yet</h3>
        </div>
      );
    }

    console.log(reviews);
    return (
      <>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="group transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xl">
                    <strong>{review.technicianFullName}</strong>
                  </span>
                  <Badge className={getRatingBadgeColor(review.rating)}>{review.rating} / 5</Badge>
                </div>
                <CardDescription>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center space-x-2">{renderStars(review.rating)}</div>
                <blockquote className="mb-2 text-gray-700 italic">{review.comment}</blockquote>
              </CardContent>
              <div className="mx-4 my-2 border-t border-gray-200" />
              <CardFooter className="flex justify-between">
                {review.owner ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEdit(review.id)}
                      disabled={deletingIds.includes(review.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingIds.includes(review.id)}
                      aria-label="Delete review">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingIds.includes(review.id) ? 'Deleting...' : 'Delete'}
                    </Button>
                  </>
                ) : user?.role === 'ADMIN' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingIds.includes(review.id)}
                    aria-label="Delete review">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingIds.includes(review.id) ? 'Removing...' : 'Remove'}
                  </Button>
                ) : (
                  <span />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        {reviews.length > 0 && (
          <div className="mt-8 text-center text-gray-600">Showing {reviews.length} reviews</div>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto mt-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary/90 mr-4 flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        </div>
        <Button asChild className="ml-auto">
          {user?.role === 'USER' && (
            <Link href="/dashboard/reviews/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Review</span>
            </Link>
          )}
        </Button>
      </div>

      {renderContent()}
    </div>
  );
};

export default ReviewsPage;
