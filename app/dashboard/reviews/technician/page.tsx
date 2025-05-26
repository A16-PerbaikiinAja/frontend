'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-provider';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Star, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: string;
  userId: string;
  technicianId: string;
  technicianFullName: string | null;
  comment: string;
  rating: number;
  createdAt: string;
}

const TechnicianReviewsPage: React.FC = () => {
  const { user } = useAuth() ?? {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/technician`;

        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch reviews');

        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const renderStars = (rating: number) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`mr-1 h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          fill={i < rating ? '#FACC15' : '#E5E7EB'}
        />
      ))}
    </div>
  );

  if (!user) return <div className="container px-4 py-8">You haven't login.</div>;

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
            <p className="font-medium text-red-600">Error: {error}</p>
          </div>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-xl font-medium text-gray-900">No reviews for you yet!</h3>
        </div>
      );
    }

    return (
      <>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="group transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex w-full items-center justify-between">
                  {renderStars(review.rating)}
                  <Badge>{review.rating} / 5</Badge>
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
                <blockquote className="mb-2 text-gray-700 italic">{review.comment}</blockquote>
              </CardContent>
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
          <h1 className="text-2xl font-bold tracking-tight">Reviews For You, {user.fullName}</h1>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default TechnicianReviewsPage;
