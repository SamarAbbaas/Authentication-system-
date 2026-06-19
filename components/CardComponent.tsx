"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@base-ui/react";

export function CardComponent() {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = async () => {
    
        const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert("Error Insert Data: " + error.message);
      return;
    }

    alert("Data Inserted: " + JSON.stringify(data));

    setTitle("");
    setContent("");
   

    }
     
  return (
    <Card className="mx-auto w-full max-w-sm">
      <div>
        {/* <CardHeader>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </CardHeader>

      <CardContent className="-mb-(--card-spacing)">
        <textarea
          placeholder="Enter Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full h-40"
        />
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={handleAdd}>Add</Button>
      </CardFooter> */}
 {/* <Card className="w-full max-w-sm"> */}
      </div>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password">Password</label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" value={content} onChange={(e)=>setContent(e.target.value)} required  placeholder="Enter a pasword here "/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleAdd} type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    {/* </Card> */}
    </Card>
    
  );
}