import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { IconInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, User } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getErrorData } from "@/utils/errors/ErrorsFunctions";

// Infer the type of the form values from the schema. we are using it also on AuthProvider.
export type LoginFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: LoginFormValues) {
    try {
      setIsPending(true);
      await login(values);
      navigate("/");
    } catch (error) {
      const { errorStatus } = getErrorData(error);
      if (errorStatus === 401) {
        form.setError("root", {
          type: "manual",
          message: "Invalid username or password.",
        });
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Card className=" pt-8 px-6 min-h-96 min-w-72 flex flex-col items-center justify-center gap-4 rounded-xl">
        <CardTitle className="text-3xl">Login</CardTitle>
        <CardContent className="w-full max-w-80 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isPending} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <IconInput
                          Icon={User}
                          type="text"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconInput
                            Icon={LockKeyhole}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                          />
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="text-red-600 text-sm font-semibold">
                    {form.formState.errors.root.message}
                  </div>
                )}
              </fieldset>

              <Separator className="my-8" />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          <CardFooter className=" mt-4">
            <p className="text-xs">
              Don't have an account?{" "}
              <Link className="underline font-bold" to="/auth/register">
                Register
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </>
  );
}

export default LoginPage;
