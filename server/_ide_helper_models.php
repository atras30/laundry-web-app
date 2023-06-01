<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Category
 *
 * @property int $id
 * @property string $title
 * @property int $price
 * @property int|null $price_per_multiplied_kg
 * @property int $is_price_per_unit
 * @property int $is_price_per_set
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $type
 * @method static \Illuminate\Database\Eloquent\Builder|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereIsPricePerSet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereIsPricePerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category wherePricePerMultipliedKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereUpdatedAt($value)
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Customer
 *
 * @property int $id
 * @property string $name
 * @property string $address
 * @property string $phone_number
 * @property int $balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\CustomerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereUpdatedAt($value)
 */
	class Customer extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Expense
 *
 * @property int $id
 * @property string $item
 * @property string $quantity
 * @property string $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Expense newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Expense newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Expense query()
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Expense whereUpdatedAt($value)
 */
	class Expense extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Order
 *
 * @property string $id
 * @property int $customer_id
 * @property string $status
 * @property string $payment_status
 * @property string $notes
 * @property int $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $done_at
 * @property-read \App\Models\Customer $customer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderUpload> $order_uploads
 * @property-read int|null $order_uploads_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SubOrder> $sub_orders
 * @property-read int|null $sub_orders_count
 * @method static \Database\Factories\OrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereDoneAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUpdatedAt($value)
 */
	class Order extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderUpload
 *
 * @property-read \App\Models\Order|null $order
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload query()
 */
	class OrderUpload extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SubOrder
 *
 * @property int $id
 * @property string $order_id
 * @property string $type
 * @property int $price_per_kg
 * @property string $amount
 * @property int $is_price_per_unit
 * @property int|null $price_per_multiplied_kg
 * @property int $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order $order
 * @method static \Database\Factories\SubOrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereIsPricePerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder wherePricePerKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder wherePricePerMultipliedKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereUpdatedAt($value)
 */
	class SubOrder extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

