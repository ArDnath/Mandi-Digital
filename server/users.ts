"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db/index";
import { eq, inArray, not } from "drizzle-orm";
import { user } from "@/db/schema";

export const getCurrentUser = async() =>{
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session || !session.user){
        redirect("/sign-in");
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id)
    });

    if (!currentUser){
        redirect("/sign-in");
    }

    return{
        ...session,
        currentUser,
    };
};

export const signIn= async(email: string, password: string)=>{
    try {
        await auth.api.signInEmail({
            body :{
                email,
                password,
            }
        });

        return {
            success: true,
            message: "Sign in successful"
        }

    } catch (error) {

        const e = error as Error;

        return {
            success: false,
            message: e.message || "An unknow error occurred.",
        }
        
    }
}

export const signUp = async(
    email: string,
    password: string,
    name: string
)=>{
   try {
     await auth.api.signUpEmail({
         body:{
             email,
             password,
             name
         }
     })

     return {
        success: true,
        message: "Signed up successfully"
     }
   } catch (error) {
     const e = error as Error;

     return {
        success: false,
        message: e.message || "An unknown error occurred.",
     }
   }
}