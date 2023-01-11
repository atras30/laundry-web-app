package umn.ac.id.project.maggot.retrofit;

import com.google.gson.Gson;

public class ApiErrorHandler {
    public String message;

    public static String getErrorMessage(String jsonString) {
        if(jsonString.isEmpty()) {
            return "The string is empty or null";
        }

        return new Gson().fromJson(jsonString, ApiErrorHandler.class).getMessage();
    }

    public String getMessage() {
        return message;
    }
}
