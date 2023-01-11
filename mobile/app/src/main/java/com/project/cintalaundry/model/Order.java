package com.project.cintalaundry;

import java.util.ArrayList;

public class Order {
    private String id, status, payment_status;
    private int total_price;
    ArrayList<SubOrder> sub_orders;

    public int getTotal_price() {
        return total_price;
    }

    public void setTotal_price(int total_price) {
        this.total_price = total_price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(String payment_status) {
        this.payment_status = payment_status;
    }

    public ArrayList<SubOrder> getSub_orders() {
        return sub_orders;
    }

    public void setSub_orders(ArrayList<SubOrder> sub_orders) {
        this.sub_orders = sub_orders;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", status='" + status + '\'' +
                ", payment_status='" + payment_status + '\'' +
                ", subOrders=" + sub_orders +
                '}';
    }
}
