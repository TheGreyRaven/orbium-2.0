'use client';

import { LoopingText } from './TextLoop';
import { Badge } from './ui/Badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/Cards';
import { PricingCarousel } from './ui/Carousel';
import { Button } from '@/components/ui/Button';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { ArrowRightCircleIcon, CogIcon } from '@heroicons/react/24/outline';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({
  session,
  user,
  products,
  subscription
}: Props) {
  const intervals = Array.from(
    new Set(
      products?.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/get-started');
    }
    if (subscription) {
      return router.push('/account');
    }
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products || products.length === 0)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );

  if (products.length === 1)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <LoopingText />

          <div className="sm:flex sm:flex-col mt-8">
            <p className="max-w-2xl text-zinc-400 text-base sm:text-xl">
              Seamlessly integrate Orbium with your applications and forum
              software, ensuring a hassle-free licensing solution that enhances
              user experience and increases revenue.
            </p>
            <p className="max-w-2xl mt-3 text-base text-zinc-400 sm:text-xl">
              See all features:{' '}
              <Link
                href="/features"
                className="text-custom-orange hover:underline"
              >
                here
              </Link>
              !
            </p>

            <div className="hidden lg:visible mt-6 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
              {products[0].prices?.map((price, index) => {
                const priceString =
                  price.unit_amount &&
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format(price.unit_amount / 100);

                return (
                  <Card
                    className={index === 0 ? 'border-custom-orange' : undefined}
                    key={price.id}
                  >
                    <CardHeader>
                      {index === 0 ? (
                        <CardTitle className="flex justify-between">
                          <div className="text-4xl font-bold">
                            {priceString}
                          </div>
                          <Badge className="bg-custom-orange h-6">
                            Popular
                          </Badge>
                        </CardTitle>
                      ) : (
                        <CardTitle>
                          <div className="text-4xl font-bold">
                            {priceString}
                          </div>
                        </CardTitle>
                      )}
                      <CardDescription className="text-base capitalize">
                        {price.interval === null ? (
                          <Badge
                            variant="outline"
                            className="border-custom-orange"
                          >
                            lifetime
                          </Badge>
                        ) : (
                          `/${price.interval}`
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="max-w-md space-y-1 ist-inside">
                        <li className="flex items-center">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          Access to all features
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          Access to support
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          Pre-made SDKs
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          Free updates
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          And much more...
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => handleCheckout(price)}
                        className="w-full py-2 text-sm font-semibold text-center text-white hover:bg-zinc-900 h-12 rounded-full flex flex-row items-center hover:text-custom-orange"
                      >
                        {products[0].name ===
                        subscription?.prices?.products?.name ? (
                          <>
                            <span className="flex-auto -mr-8">Manage</span>
                            <CogIcon className="h-full flex-none text-custom-orange" />
                          </>
                        ) : (
                          <>
                            <span className="flex-auto -mr-8">Get started</span>
                            <ArrowRightCircleIcon className="h-full flex-none text-custom-orange" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="visible lg:hidden mt-14">
              <PricingCarousel>
                {products[0].prices?.map((price, index) => {
                  const priceString =
                    price.unit_amount &&
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: price.currency!,
                      minimumFractionDigits: 0
                    }).format(price.unit_amount / 100);

                  return (
                    <Card
                      className={
                        index === 0 ? 'border-custom-orange' : undefined
                      }
                      key={price.id}
                    >
                      <CardHeader>
                        {index === 0 ? (
                          <CardTitle className="flex justify-between">
                            <div className="text-4xl font-bold">
                              {priceString}
                            </div>
                            <Badge className="bg-custom-orange h-6">
                              Popular
                            </Badge>
                          </CardTitle>
                        ) : (
                          <CardTitle>
                            <div className="text-4xl font-bold">
                              {priceString}
                            </div>
                          </CardTitle>
                        )}
                        <CardDescription className="text-base capitalize">
                          {price.interval === null ? (
                            <Badge
                              variant="outline"
                              className="border-custom-orange"
                            >
                              lifetime
                            </Badge>
                          ) : (
                            `/${price.interval}`
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="max-w-md space-y-1 ist-inside">
                          <li className="flex items-center">
                            <svg
                              className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Access to all features
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Access to support
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Pre-made SDKs
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            Free updates
                          </li>
                          <li className="flex items-center">
                            <svg
                              className="w-3.5 h-3.5 me-2 text-custom-orange flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                            </svg>
                            And much more...
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => handleCheckout(price)}
                          className="w-full py-2 text-sm font-semibold text-center text-white hover:bg-zinc-900 h-12 rounded-full flex flex-row items-center hover:text-custom-orange"
                        >
                          {products[0].name ===
                          subscription?.prices?.products?.name ? (
                            <>
                              <span className="flex-auto -mr-8">Manage</span>
                              <CogIcon className="h-full flex-none text-custom-orange" />
                            </>
                          ) : (
                            <>
                              <span className="flex-auto -mr-8">
                                Get started
                              </span>
                              <ArrowRightCircleIcon className="h-full flex-none text-custom-orange" />
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </PricingCarousel>
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
          <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
            {intervals.includes('month') && (
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={`${
                  billingInterval === 'month'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={`${
                  billingInterval === 'year'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Yearly billing
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{product.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button
                    type="button"
                    disabled={!session}
                    onClick={() => handleCheckout(price)}
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                  >
                    {subscription ? 'Manage' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
