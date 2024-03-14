<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller
{
    public function getUser()
    {
        return response()->json([
            "user" => auth()->user()
        ], Response::HTTP_OK);
    }

    public function loginByGoogle(Request $request)
    {
        $user = Socialite::driver('google')->user();

        $user = User::where("email", $user->user['email'])->first();

        if (!$user) {
            return view("login.google");
        }

        $token = $user->createToken("login token")->plainTextToken;

        return redirect(env("APP_CLIENT_URL") . "/#/?token={$token}");
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
            ], Response::HTTP_BAD_REQUEST);
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

    public function loginByGooglePage()
    {
        return Socialite::driver('google')->redirect();
    }
}
