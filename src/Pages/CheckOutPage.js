import React from 'react'
import { Link, Navigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../features/cart/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"
import { selectLoggedInUser, updateUserAsync } from '../features/auth/authSlice';
import { createOrderAsync, selectCurrentOrder } from '../features/Order/orderSlice';
import { selectUserInfo } from '../features/user/userSlice';


const products = [
    {
        id: 1,
        name: 'Throwback Hip Bag',
        href: '#',
        color: 'Salmon',
        price: '$90.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
        imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
    },
    {
        id: 2,
        name: 'Medium Stuff Satchel',
        href: '#',
        color: 'Blue',
        price: '$32.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
        imageAlt:
            'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    },
    {
        id: 2,
        name: 'Medium Stuff Satchel',
        href: '#',
        color: 'Blue',
        price: '$32.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
        imageAlt:
            'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    },
    {
        id: 2,
        name: 'Medium Stuff Satchel',
        href: '#',
        color: 'Blue',
        price: '$32.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
        imageAlt:
            'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    },
    {
        id: 2,
        name: 'Medium Stuff Satchel',
        href: '#',
        color: 'Blue',
        price: '$32.00',
        quantity: 1,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
        imageAlt:
            'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    },
    // More products...
]

const CheckOutPage = () => {
    const [selectAddress, setSelectAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    // const user = useSelector(selectLoggedInUser)
    const user = useSelector(selectUserInfo)
    // console.log('checkout',user)
    const userData = { ...user }
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const items = useSelector(selectItems);
    const currentOrder = useSelector(selectCurrentOrder)
    // console.log(currentOrder)
    const [open, setOpen] = useState(true)

    const totalAmount = items.reduce((amount, item) => {
        const price = parseFloat(item?.productDetails?.classDetails?.book?.price.replace(/[^0-9.]/g, ''));
        return price * item.quantity + amount;
    }, 0);
    const totalItems = items.reduce((total, item) => item.quantity + total, 0)
    const handleQuantity = (e, item) => {
        dispatch(updateCartAsync({ ...item, quantity: +e.target.value }))
    }
    const handleRemove = (e, itemId) => {
        dispatch(deleteItemFromCartAsync(itemId))
    };
    const onSubmit = (data) => {
        // console.log(data);
        const updatedAddresses = [...user.addresses, data]; // Concatenate the new address to the existing array
        const updatedUser = { ...user, addresses: updatedAddresses };
        // console.log(updatedUser);
        dispatch(updateUserAsync(updatedUser));
        reset();
    };
    const handleAddress = (e) => {
        // console.log(e.target.value)
        setSelectAddress(user.addresses[e.target.value]);
        // console.log(selectAddress)
    }
    const handlePayment = (e) => {
        console.log(e.target.value)
        setPaymentMethod(e.target.value);
        // console.log(selectAddress)
    }
    const handleOrder = (e) => {
        if (selectAddress && paymentMethod) {
            const order = {
                items,
                totalAmount,
                totalItems,
                userData,
                paymentMethod,
                selectAddress,
                status: 'pending'
            };
            // console.log(order)
            dispatch(createOrderAsync(order));
            //    TODO Redirection to success page
            // clear cart after order
        } else {
            alert("Enter Address and Payment Method")
        }
    }
    return (
        <>
            {!items.length && <Navigate to='/' replace={true}></Navigate>}
            {currentOrder && <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>}
            <div className='bg-white grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10'>
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8 lg:col-span-3">
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <div className="border-b border-gray-900/10 pb-12">
                            <h1 className=" font-semibold leading-7 text-4xl py-7  text-gray-900">Checkout </h1>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            {...register("name", { required: "Name is required", maxLength: 20 })}
                                            id="name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                                    </div>
                                </div>


                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            {...register("email", {
                                                required: "Email is required", pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: 'Invalid email address',
                                                },
                                            })}
                                            type="email"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Phone Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="phone"
                                            {...register("phone", {
                                                required: "Phone Number is required",
                                                pattern: {
                                                    value: /^\d{10}$|^\d{3}-\d{3}-\d{4}$|^\(\d{3}\) \d{3}-\d{4}$/,
                                                    message: 'Invalid phone number',
                                                },
                                            })}
                                            type="tel"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}

                                    </div>
                                </div>



                                <div className="col-span-full">
                                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                        Street address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            {...register("street", { required: "Street address is required" })}
                                            id="street-address"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.street && <p className='text-red-500'>{errors.street.message}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                        City
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            {...register("city", { required: "City is required" })}
                                            id="city"
                                            autoComplete="address-level2"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                        State / Province
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            {...register("state", { required: "State is required" })}
                                            id="state"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                        ZIP / Pin code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            {...register("pincode", { required: "Pin Code is required" })}
                                            id="pin-code"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.pincode && <p className='text-red-500'>{errors.pincode.message}</p>}
                                    </div>
                                    <div className="mt-6 flex items-center justify-end gap-x-6">
                                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Addresses</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Choose from existing address
                            </p>
                            <ul role="list" className="divide-y divide-gray-400">
                                {user?.addresses?.map((address, index) => (
                                    <li key={index} htmlFor={address.pincode} className="flex justify-between gap-x-6 py-5 px-2 rounded-sm">
                                        <div className="flex min-w-0 gap-x-4">
                                            <input
                                                onChange={handleAddress}
                                                id={address.pincode}
                                                name="address"
                                                type="radio"
                                                value={index}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <div className="min-w-0 flex-auto ">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{address.street}</p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{address.city}</p>
                                            </div>
                                        </div>
                                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                            <p className="text-sm leading-6 text-gray-900">Phone:  {address.phone}</p>
                                            <p className="text-sm leading-6 text-gray-900">{address.state}</p>
                                            <p className="text-sm leading-6 text-gray-900">{address.pincode}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 space-y-10">

                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Method</legend>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">Choose One</p>
                                    <div className="mt-6 space-y-6">
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="cash"
                                                name="paymemts"
                                                onChange={handlePayment}
                                                type="radio"
                                                value='cash'
                                                checked={paymentMethod === 'cash'}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Cash                                            </label>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="creditCard"
                                                name="paymemts"
                                                onChange={handlePayment}
                                                type="radio"
                                                value='card'
                                                checked={paymentMethod === 'card'}
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                                Credit Card                                            </label>
                                        </div>

                                        {/* <div className="flex items-center gap-x-3">
                                            <input
                                                id="upi"
                                                name="paymemts"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                                UPI Method                                            </label>
                                        </div> */}
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>


                {/* pay now section */}
                <div className="col-span-2">
                    <div className="mx-auto max-w-screen px-6 lg:px-8 my-4  ">

                        <div className="flex h-full flex-col  bg-white shadow-xl">
                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <p className="text-lg font-medium text-gray-900">Shopping cart</p>

                                </div>

                                <div className="mt-8">
                                    <div className="flow-root">
                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                            {items.map((item) => (
                                                <li key={item.id} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={item?.productDetails?.classDetails?.book?.images[2]}
                                                            // alt={product.imageAlt}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <p href={item.href}>{item.subjectName}</p>
                                                                    <p href={item.href}>{item.className}</p>
                                                                    <p>{item.publisherName}</p>
                                                                </h3>
                                                                <p className="ml-4">{item?.productDetails?.classDetails?.book?.price}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{item?.productDetails?.classDetails?.book?.title}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">

                                                            <label className='text-gray-500' htmlFor="qty">Qty </label>
                                                            <select onChange={(e) => handleQuantity(e, item)} value={item.quantity} className="py-2 px-1 border  border-gray-200 mr-6 focus:outline-none">
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                                <option value="6">6</option>
                                                                <option value="7">7</option>
                                                                <option value="8">8</option>
                                                            </select>

                                                            <div className="flex">
                                                                <button
                                                                    onClick={(e) => handleRemove(e, item.id)}
                                                                    type="button"
                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p> ${totalAmount}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Total Items in Cart</p>
                                    <p>🛒 {totalItems} Items</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                    <div
                                        onClick={handleOrder}
                                        className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                    >
                                        Order now
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                        or
                                        <Link to='/'>
                                            <button
                                                type="button"
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                onClick={() => setOpen(false)}
                                            >
                                                &nbsp; Continue Shopping
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckOutPage