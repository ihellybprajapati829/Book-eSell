using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStore.Models.ViewModels;

namespace BookStore.Models.Model
{
    public class CartBook
    {
        public string BookName { get; set; }
        public decimal Price { get; set; }
    }
}
