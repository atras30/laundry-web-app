package umn.ac.id.project.maggot.retrofit;

import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;
import umn.ac.id.project.maggot.model.ApprovalRejectionModel;
import umn.ac.id.project.maggot.model.AuthenticationModel;
import umn.ac.id.project.maggot.model.NotificationUserModel;
import umn.ac.id.project.maggot.model.PeternakModel;
import umn.ac.id.project.maggot.model.TransactionModel;
import umn.ac.id.project.maggot.model.TrashManagerModel;
import umn.ac.id.project.maggot.model.UserModel;
import umn.ac.id.project.maggot.model.WarungModel;

public interface ApiEndpoint {
    @GET("auth/user")
    @Headers("Accept: application/json")
    Call<UserModel> getUser(@Header("Authorization") String authorization);

    @GET("auth/user")
    @Headers("Accept: application/json")
    Call<TrashManagerModel> updateTrashManagerData(@Header("Authorization") String authorization);

    @GET("user/role/farmer")
    @Headers("Accept: application/json")
    Call<PeternakModel> getPeternak();

    @GET("user/email/{email}")
    @Headers("Accept: application/json")
    Call<UserModel> getUserByEmail(@Path("email") String email);

    @DELETE("user/{id}")
    @Headers("Accept: application/json")
    Call<UserModel> deleteUser(@Path("id") int id);

    @GET("user/role/shop")
    @Headers("Accept: application/json")
    Call<WarungModel> getWarung();

    @GET("trash-manager")
    @Headers("Accept: application/json")
    Call<TrashManagerModel> getTrashManager();

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("transaction/farmer/buy/shop")
    Call<TransactionModel> farmerBuyFromShop(@Header("Authorization") String authorization, @Field("total_amount") double totalAmount, @Field("shop_email") String shopEmail);

    @FormUrlEncoded
    @POST("auth/login")
    @Headers("Accept: application/json")
    Call<AuthenticationModel> login(@Field("google_token") String googleToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("auth/logout")
    Call<AuthenticationModel> logout(@Header("Authorization") String authorization, @Field("any") String any);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("register/user")
    Call<AuthenticationModel> registerUser(@Field("full_name") String fullName, @Field("email") String email, @Field("role") String role, @Field("trash_manager_id") int trashManagerId, @Field("address") String address, @Field("phone_number") String phoneNumber);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("register/user/approve")
    Call<ApprovalRejectionModel> approvalUserRegistration(@Field("email") String email);

    @FormUrlEncoded
    @POST("register/user/reject")
    @Headers("Accept: application/json")
    Call<ApprovalRejectionModel> rejectionUserRegistration(@Field("email") String email);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("transaction/trash-manager/buy/maggot")
    Call<TransactionModel> buyMaggot(@Header("Authorization") String authorizationToken,@Field("weight_in_kg") double weightInKg, @Field("amount_per_kg") double amountPerKg, @Field("farmer_email") String farmerEmail, @Field("description") String description);

    @GET("transactions")
    @Headers("Accept: application/json")
    Call<TransactionModel> getTransactions(@Query("email") String email);

    @GET("notifications")
    @Headers("Accept: application/json")
    Call<NotificationUserModel> getAllNotifications(@Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/farmer/withdrawal/approve")
    Call<NotificationUserModel> approveWithdrawalRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/farmer/withdrawal/reject")
    Call<NotificationUserModel> rejectFarmerWithdrawalRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/trash-manager/withdrawal/farmer")
    Call<NotificationUserModel> createFarmerWithdrawalRequest(@Field("farmer_email") String farmerEmail, @Field("withdrawal_amount") double withdrawalAmount,@Header("Authorization") String token);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/trash-manager/withdrawal/shop")
    Call<NotificationUserModel> createShopWithdrawalRequest(@Field("shop_email") String farmerEmail, @Field("withdrawal_amount") double withdrawalAmount,@Header("Authorization") String token);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/shop/farmer/purchase/approve")
    Call<NotificationUserModel> approveShopBuyRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/shop/withdrawal/approve")
    Call<NotificationUserModel> approveShopWithdrawalRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/shop/withdrawal/reject")
    Call<NotificationUserModel> rejectShopWithdrawalRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

    @FormUrlEncoded
    @Headers("Accept: application/json")
    @POST("notifications/shop/farmer/purchase/reject")
    Call<NotificationUserModel> rejectShopBuyRequest(@Field("token") String token, @Header("Authorization") String authorizationToken);

}
