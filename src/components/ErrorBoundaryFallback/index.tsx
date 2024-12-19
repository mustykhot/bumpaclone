import { Button } from "@mui/material";

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: {
  error?: any;
  resetErrorBoundary?: any;
}) {
  return (
    <>
      <section className="relative flex min-h-screen w-full items-center justify-center bg-grey_100 md:py-6 md:px-8">
        <div className="mb-12 flex h-screen min-h-[300px] w-full max-w-[600px] flex-col items-center justify-center rounded-2xl bg-grey_90 px-6 py-12 md:h-auto lg:rounded-[35px]">
          {/* <ErrorMascot className="mt-auto md:mt-0" /> */}
          <p className="font-Bai text-2xl font-semibold tracking-[-4%] md:text-4xl">
            Oops!
          </p>
          <p className="mt-2 text-center font-Mulish text-base font-[400] text-grey_30">
            Looks like the page you're trying to visit is broken <br />
            {error?.message}
          </p>
          <div className="mt-auto w-full space-y-4 md:mt-10 md:max-w-[270px]">
            <Button variant="contained" fullWidth onClick={resetErrorBoundary}>
              Try again
            </Button>
            <Button
              variant="outlined"
              fullWidth
              component="a"
              href="/dashboard"
            >
              Go Home
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
