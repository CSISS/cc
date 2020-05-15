

edu.gmu.csiss.covali.login = {
	doLogin: function() {
		var username = $("#name").val();
		var password = $("#password").val();
		var remember = $("#remember").val();
		console.log(username);

		edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.jsframe.LoginDialog');

		$.ajax({
			url: "auth",
			type: "POST",
			data: { name: username, password: password, _remember: remember }

		}).success(function(data){

			data = $.parseJSON(data);

			if(data.ret=="true"){

				console.log("login success");

				alert(username + " logged in!")

				callback(param1, param2);

				dialogItself.close();

			}else{

				console.log("login failed");

				alert("Login failed: " + data.message);

			}

		}).fail(function(data){

			alert("Fail to login");

		});

	},

	loginDialog: function(callback, param1, param2){
		var dialogTitle = "Login Dialog";
		var dialogName = 'edu.gmu.csiss.covali.jsframe.LoginDialog';

		var html = "" +
			"<div class=\"login-form-1\"> "+

				"	<form id=\"main-login-form\" class=\"text-left\" method=\"post\"> "+

				"		<div class=\"login-form-main-message\"></div> "+

				"		<div class=\"main-login-form\"> "+

				"			<div class=\"login-group\"> "+

				"				<div class=\"form-group\"> "+

				"					<label for=\"reg_username\" class=\"sr-only\">Username</label>	 "+
				"					<input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"username\"/> "+

				"				</div> "+

				"				<div class=\"form-group\"> "+

				"					<label class=\"sr-only\">Password</label> "+

				"					<input type=\"password\" class=\"form-control\"  id=\"password\"  placeholder=\"password\"/> "+

				"				</div> "+

				"				<div class=\"form-group login-group-checkbox\"> "+

				"					<input type=\"checkbox\" id=\"remember\"/> "+

				"					<label for=\"remember\">remember</label> "+

				"				</div> "+

				"			</div> "+

				"		</div> "+

				"		<div class=\"etc-login-form\"> "+

				"			<p>forgot your password? <a href=\"user_forget\" target=\"_blank\" >click here</a></p> "+

				"			<p>new user? <a href=\"user_register\" target=\"_blank\" >create new account</a></p> "+

				"		</div> "+

				"	</form> "+

				"</div>";

		var content = '<div class="modal-body" style="font-size: 12px;">';
		content += html;
		content += '</div>';

		content += "<div class=\"modal-footer\">" +
		"<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.login.doLogin()\'>Login</span>" +
		"</div>";

		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 360, 400);

	}

}