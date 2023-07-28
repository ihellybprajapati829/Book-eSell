using Microsoft.AspNetCore.Mvc;
using System.Linq;
using BookStore.Models.Model;
using BookStore.Repository;
using BookStore.Models.ViewModels;

namespace BookStore.Api.Controllers
{
    [ApiController]
    [Route("role")]
    public class RoleController : ControllerBase
    {
        RoleRepository _repo = new RoleRepository();
        [Route("list")]
        [HttpGet]
        public IActionResult GetRoles()
        {
            var roles = _repo.GetRoles();
            ListResponse<RoleModel> roleList = new()
            {
                Results = roles.Results.Select(c => new RoleModel(c)),
                TotalRecords = roles.TotalRecords,
            };

            return Ok(roleList);
        }
    }
}