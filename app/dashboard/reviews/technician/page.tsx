'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-provider';
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
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
    if (!user?.id) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review/technician/${user.id}`;
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
  }, [user?.id]);

  const renderStars = (rating: number) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 mr-1 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          fill={i < rating ? '#FACC15' : '#E5E7EB'}
        />
      ))}
    </div>
  );

  if (!user)
    return <div className="container px-4 py-8">You haven't login.</div>;
  if (loading)
    return (
      <div className="container px-4 py-8 flex justify-center items-center">
        <span>Loading Reviews...</span>
      </div>
    );
  if (error)
    return (
      <div className="container px-4 py-8 flex justify-center items-center">
        <span className="text-red-500">Error: {error}</span>
      </div>
    );

  return (
    <div className="container mx-auto p-4 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary/90 mr-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Reviews For You, {user.fullName}</h1>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Belum ada review untuk Anda
          </h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
                <blockquote className="text-gray-700 italic mb-2">
                  {review.comment}
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          Showing {reviews.length} reviews
        </div>
      )}
    </div>
  );
};

export default TechnicianReviewsPage;