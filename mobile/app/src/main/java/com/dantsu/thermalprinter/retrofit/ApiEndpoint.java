package com.dantsu.thermalprinter.retrofit;

import com.dantsu.thermalprinter.model.Order;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.Path;

public interface ApiEndpoint {
    @GET("orders/{id}")
    @Headers("Accept: application/json")
    Call<Order> getOrder(@Path("id") String id);
}
