import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Bars3Icon, BookOpenIcon, CogIcon, ArrowRightEndOnRectangleIcon, QuestionMarkCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="bg-black sticky sm:top-6 top-0 bg-opacity-80 sm:mx-auto sm:max-w-6xl sm:rounded-full z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div>
          <a href="/" className="flex flex-row items-center hover:text-custom-orange">
            <img className="h-12 w-auto" src="/Orbium.png" alt="" />
            <h1 className="text-2xl font-bold">Orbium</h1>
          </a>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/features">
            <div className="items-center flex flex-row mr-4 hover:text-custom-orange">
              <StarIcon className="mr-2 h-6 w-6" color='white'/> Features
            </div>
          </Link>

          <Link href="/faq">
            <div className="items-center flex flex-row mr-4 hover:text-custom-orange">
              <QuestionMarkCircleIcon className="mr-2 h-6 w-6" color='white'/> FAQ
            </div>
          </Link>

          <Link href="/blog">
            <div className="items-center flex flex-row mr-4 hover:text-custom-orange">
              <BookOpenIcon className="mr-2 h-6 w-6" color='white'/> Blog
            </div>
          </Link>

          {user ? (
            <Link href="/account">
              <div className="items-center flex flex-row mr-4 hover:text-custom-orange">
                <CogIcon className="mr-2 h-6 w-6" color='white'/> Dashboard
              </div>
            </Link>
          ) : (
            <Link href="/get-started">
              <div className="items-center flex flex-row mr-4 hover:text-custom-orange">
                <ArrowRightEndOnRectangleIcon className="mr-2 h-6 w-6" color='white'/> Login
              </div>
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <Bars3Icon className="h-6 w-6 " aria-hidden="true" color="white" />
              </button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <h1 className="text-2xl font-bold">Orbium</h1>
                </SheetTitle>
                <SheetDescription>
                  List of links available
                </SheetDescription>
              </SheetHeader>

              <Separator className="mt-4" />

              {user ? (
                <Link href="/account">
                  <Button variant="outline" className="w-full mt-4">
                    <CogIcon className="mr-2 h-4 w-4" color='white'/> Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/get-started">
                  <Button variant="outline" className="w-full mt-4">
                    <ArrowRightEndOnRectangleIcon className="mr-2 h-4 w-4" color='white'/> Login
                  </Button>
                </Link>
              )}

              <Link href="/features">
                <Button variant="outline" className="w-full mt-4">
                  <StarIcon className="mr-2 h-4 w-4" color='white'/> Features
                </Button>
              </Link>

              <Link href="/faq">
                <Button variant="outline" className="w-full mt-4">
                  <QuestionMarkCircleIcon className="mr-2 h-4 w-4" color='white'/> FAQ
                </Button>
              </Link>

              <Link href="/blog">
                <Button variant="outline" className="w-full mt-4">
                  <BookOpenIcon className="mr-2 h-4 w-4" color='white'/> Blog
                </Button>
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}