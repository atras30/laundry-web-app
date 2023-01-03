<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    public function getUser()
    {
        return response()->json([
            "user" => auth()->user()
        ], Response::HTTP_OK);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            "email" => "string|required",
            "password" => "string|required"
        ], [
            "email.string" => "Email harus diisi",
            "password.string" => "Password harus diisi"
        ]);

        $user = User::firstWhere("email", $validated['email']);

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                "message" => "Email atau password salah."
            ], Response::HTTP_NOT_ACCEPTABLE);
        }

        $token = $user->createToken("login token")->plainTextToken;


        return response()->json([
            "user" => $user,
            "token" => $token,
            "message" => "Login berhasil."
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
    }
}
