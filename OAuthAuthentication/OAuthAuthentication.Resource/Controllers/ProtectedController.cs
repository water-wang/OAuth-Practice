using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace OAuthAuthentication.Resource.Controllers
{
    public class ProtectedController:ApiController
    {
        [Authorize]
        public IEnumerable<object> Get()
        {
            var identity = User.Identity as ClaimsIdentity;

            return identity.Claims.Select(u => new
                {
                    Type = u.Type,
                    Value = u.Value
                });
        }
    }
}