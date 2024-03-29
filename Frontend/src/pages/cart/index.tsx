import React, { useEffect, useState } from "react";
import { cartStyle } from "./style";
import { Typography, Button, Link } from "@material-ui/core";
import { CartList } from "../../models/CartModel";
import cartService from "../../service/cart.service";
import { AuthContextModel, useAuthContext } from "../../context/auth";
import { toast } from "react-toastify";
// import orderService from "../../service/order.service";
// import { OrderAddModel } from "../../models/OrderModel";
import Shared from "../../utils/shared";
import { CartContextModel, useCartContext } from "../../context/cart";
import { useHistory } from "react-router-dom";

const Cart: React.FC = () => {
  const authContext: AuthContextModel = useAuthContext();
  const cartContext: CartContextModel = useCartContext();
  const history = useHistory();

  const [BookList, setBookList] = useState<CartList[]>([]);
  const [ItemsInCart, setItemsInCart] = useState<number>(0);
  const [TotalPrice, setTotalPrice] = useState<number>(0);

  const classes = cartStyle();

  const getTotalPrice = (ItemList: CartList[]) => {
    let totalPrice = 0;
    console.log("item", ItemList);
    console.log("from cart cartcontext", cartContext.cartData.results);
    ItemList.forEach((item: CartList) => {
      const itemPrice = item.quantity * parseInt(item.price?.toString());
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    setBookList(cartContext.cartData.results);
    setItemsInCart(cartContext.cartData.totalRecords);
    getTotalPrice(cartContext.cartData.results);
  }, [cartContext.cartData.results, cartContext.cartData.totalRecords]);

  const removeItem = async (id: number) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const updateQuantity = async (cartItem: CartList, inc: Boolean, e: any) => {
    const current_count = parseInt(
      e.target.closest(".qty-group").children[1].innerText
    );
    const quantity = inc ? current_count + 1 : current_count - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }
    cartService
      .updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.bookId as number,
        quantity,
      })
      .then((res) => {
        if (res) {
          const item: CartList | undefined = BookList.find(
            (item) => item.bookId === cartItem.bookId
          );
          if (item) {
            e.target.closest(".qty-group").children[1].innerText = quantity;
            const newPrice = inc
              ? TotalPrice + parseInt(item.price.toString())
              : TotalPrice - parseInt(item.price.toString());
            setTotalPrice(newPrice);
          }
        }
      });
  };

  const Back = () => {
    history.push("/");
  }

  /*const PlaceOrder = async () => {
    if (authContext.user.id) {
      const userCart = await cartService.getList(authContext.user.id);
      if (userCart.totalRecords) {
        try {
          let cartIds: number[] = [];
          userCart.results.forEach((element: CartList) => {
            cartIds.push(element.id);
          });
          const newOrder: OrderAddModel = {
            userId: authContext.user.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            cartContext.updateCart();
            history.push("/");
            toast.success(Shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };*/

  return (
    <div className={classes.cartWrapper}>
      <div className="container">
        <Typography variant="h1">Cart page</Typography>
        <div className="cart-heading-block">
          <Typography variant="h2">
            My Shopping Bag ({ItemsInCart} Items)
          </Typography>
          <div className="total-price">Total price: {TotalPrice}</div>
        </div>
        <div className="cart-list-wrapper">
          {BookList?.map((cartItem: CartList) => {
            return (
              <div className="cart-list-item" key={cartItem.id}>
                <div className="cart-item-img">
                  <Link>
                    <img src={cartItem.base64image} alt="dummy-pic" />
                  </Link>
                </div>
                <div className="cart-item-content">
                  <div className="cart-item-top-content">
                    <div className="cart-item-left">
                      <p className="brand">{cartItem.name}</p>
                      {/* <Link>Cart item name</Link> */}
                    </div>
                    <div className="price-block">
                      <span className="current-price">
                        MRP &#8377; {cartItem.price}
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-bottom-content">
                    <div className="qty-group">
                      <Button
                        className="btn pink-btn"
                        onClick={(e: any) => updateQuantity(cartItem, true, e)}
                      >
                        +
                      </Button>
                      <span className="number-count">{cartItem.quantity}</span>
                      <Button
                        className="btn pink-btn"
                        onClick={(e: any) => updateQuantity(cartItem, false, e)}
                      >
                        -
                      </Button>
                    </div>
                    <Link onClick={() => removeItem(cartItem.id)}>Remove</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="btn-wrapper">
          {/* <Button className="btn pink-btn" onClick={PlaceOrder}> */}
          <Button className="btn pink-btn">
            Place order
          </Button>&nbsp;&nbsp;&nbsp;
          <Button className="btn pink-btn" onClick={Back}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;