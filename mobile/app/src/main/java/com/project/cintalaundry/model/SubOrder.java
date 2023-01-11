package com.project.cintalaundry;

public class SubOrder {
    private String type, amount;
    int price_per_kg, price_per_multiplied_kg, total;
    boolean is_price_per_unit;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getPrice_per_kg() {
        return price_per_kg;
    }

    public void setPrice_per_kg(int price_per_kg) {
        this.price_per_kg = price_per_kg;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public int getPrice_per_multiplied_kg() {
        return price_per_multiplied_kg;
    }

    public void setPrice_per_multiplied_kg(int price_per_multiplied_kg) {
        this.price_per_multiplied_kg = price_per_multiplied_kg;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public boolean getIs_price_per_unit() {
        return is_price_per_unit;
    }

    public void setIs_price_per_unit(boolean is_price_per_unit) {
        this.is_price_per_unit = is_price_per_unit;
    }

    @Override
    public String toString() {
        return "SubOrder{" +
                "type='" + type + '\'' +
                ", price_per_kg=" + price_per_kg +
                ", amount=" + amount +
                ", price_per_multiplied_kg=" + price_per_multiplied_kg +
                ", total=" + total +
                ", is_price_per_unit=" + is_price_per_unit +
                '}';
    }
}
