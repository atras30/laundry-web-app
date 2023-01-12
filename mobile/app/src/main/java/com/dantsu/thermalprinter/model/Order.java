package com.dantsu.thermalprinter.model;

import java.util.ArrayList;

public class Order {
    private String id, status, payment_status, notes;
    private int price;
    private Customer customer;
    ArrayList<SubOrder> sub_orders;

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Order order;

    public Order getOrder() {
        return order;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
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
