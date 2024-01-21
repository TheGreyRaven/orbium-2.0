import { getSession } from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Cards';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/account');
  }

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="items-center">
          <CardTitle className="text-2xl">Welcome to Orbium</CardTitle>
          <CardDescription>Please sign in or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="create">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="login">

            </TabsContent>
            <TabsContent value="create">Change your password here.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
