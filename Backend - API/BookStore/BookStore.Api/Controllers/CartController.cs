using Microsoft.AspNetCore.Mvc;
using BookStore.Models.ViewModels;
using BookStore.Models.Model;
using BookStore.Repository;
using System.Net;

namespace BookStore.Api.Controllers
{
    [ApiController]
    [Route("cart")]
    public class CartController : Controller
    {
        private readonly CartRepository _cartRepository = new();

        /*[HttpGet]
        [Route("list")]
        public IActionResult GetCartItems(string keyword)
        {
            List<Cart> carts = _cartRepository.GetCartItems(keyword);
            IEnumerable<CartModel> cartModels = carts.Select(c => new CartModel(c));
            return Ok(cartModels);
        }*/
        [HttpGet]
        [Route("list")]
        [ProducesResponseType(typeof(ListResponse<CartModel>), (int)HttpStatusCode.OK)]
        public IActionResult GetCartItem(string? keyword, int pageIndex = 1, int pageSize = 10)
        {

            var cartitem = _cartRepository.GetCartList(pageIndex, pageSize, keyword);
            ListResponse<CartModel> listResponce = new ListResponse<CartModel>()
            {
                Results = cartitem.Results.Select(c => new CartModel(c)),
                TotalRecords = cartitem.TotalRecords,
            };

            return Ok(listResponce);
        }



        [HttpGet]
        [Route("listbyId")]
        [ProducesResponseType(typeof(ListResponse<CartResponse>), (int)HttpStatusCode.OK)]
        public IActionResult GetCartItem2(int UserId)
        {

            var cartitem = _cartRepository.GetCartListall(UserId);
            ListResponse<CartResponse> listResponce = new ListResponse<CartResponse>()
            {
                Results = cartitem.Results.Select(c => new CartResponse(c)),
                TotalRecords = cartitem.TotalRecords,
            };

            return Ok(listResponce);
        }


        [HttpPost]
        [Route("add")]
        public IActionResult AddCart(CartModel model)
        {
            if (model == null)
                return BadRequest();

            Cart cart = new Cart()
            {
                Id = model.Id,
                Quantity = 1,
                Bookid = model.BookId,
                Userid = model.UserId
            };
            cart = _cartRepository.AddCart(cart);

            return Ok(new CartModel(cart));
        }

        [HttpPut]
        [Route("update")]
        public IActionResult UpdateCart(CartModel model)
        {
            if (model == null)
                return BadRequest();

            Cart cart = new Cart()
            {
                Id = model.Id,
                Quantity = model.Quantity,
                Bookid = model.BookId,
                Userid = model.UserId
            };
            cart = _cartRepository.UpdateCart(cart);

            return Ok(new CartModel(cart));
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public IActionResult DeleteCart(int id)
        {
            if (id == 0)
                return BadRequest();

            bool response = _cartRepository.DeleteCart(id);
            return Ok(response);
        }
    }
}
