package com.dantsu.thermalprinter.retrofit;

import com.google.gson.Gson;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiService {
    public static String localhost = "http://10.0.2.2:8000/api/";
    public static String localhostWithoutApiPath = "http://10.0.2.2:8000/";

    public static String sharedhosting = "https://atras.my.id/api/";
    public static String sharedhostingWithoutApiPath = "https://atras.my.id/";

    public static String production = "https://api.cintalaundry.atras.my.id/api/";
    public static String productionWithoutApiPath = "https://api.cintalaundry.atras.my.id/";

    private static String BASE_URL = production;
    private static String BASE_URL_WITHOUT_API_PATH = productionWithoutApiPath;

    private static Retrofit retrofit;

    public static ApiEndpoint endpoint() {
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        return retrofit.create(ApiEndpoint.class);
    }

    public static String getBaseUrl() {
        return BASE_URL;
    }

    public static String getBaseUrlWithoutApiPath() {
        return BASE_URL_WITHOUT_API_PATH;
    }

    public static String parseErrorMessage(String jsonErrorMessage) {
        return new Gson().fromJson(jsonErrorMessage, ApiErrorHandler.class).getMessage();
    }
}