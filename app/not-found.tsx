import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="text-6xl font-bold text-primary">
              404
            </CardTitle>
            <CardDescription className="text-xl mt-4">
              Page Not Found
            </CardDescription>
            <p className="text-muted-foreground mt-2">
              The page you are looking for does not exist or has been moved.
            </p>
          </CardHeader>
          <CardFooter className="justify-center gap-3">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs" className="inline-flex items-center gap-2">
                <Search size={16} />
                Search Docs
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
