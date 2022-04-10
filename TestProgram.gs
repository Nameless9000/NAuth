import_code("/home/user/Library.src") // edit this to the location of the library

// load the library
NAuth = NAuthLibrary

ProgramName = "SecureLogin"

// very secure password storage!
Logins = {"Nameless":{"password":"password123","secret":"802D3652306E2132894B40F06"}}

clear_screen

print("[SECURE LOGIN]")

print("U2VjdXJlTG9naW46TmFtZWxlc3M6ODAyRDM2NTIzMDZFMjEzMjg5NEI0MEYwNg==")
//// you can add the ability to add mfa to accounts by saving the account data to a file
// auth = NAuth.GenerateSecret(ProgramName, Username)
// auth.secret = "802D3652306E2132894B40F06"
// auth.code = "U2VjdXJlTG9naW46TmFtZWxlc3M6ODAyRDM2NTIzMDZFMjEzMjg5NEI0MEYwNg=="

username = user_input("Enter Username: ")
password = user_input("Enter Password: ", 1)

if not Logins.hasIndex(username) then exit("Incorrect username and/or password.")
user = Logins[username]

if password != user.password then exit("Incorrect username and/or password.")

print("Login Successful!")

if user.secret then
    auth_code = user_input("Enter MFA Code: ")
    real_auth_code = NAuth.GetCode(user.secret)

    if auth_code != real_auth_code then exit("Incorrect MFA code.")
end if

exit("Test Program Finished.")
