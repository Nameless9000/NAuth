import_code("/home/user/Library.src")

// load the library
NAuth = NAuthLibrary

shell = get_shell
comp = shell.host_computer

if not comp.File(home_dir+"/AuthManager") then
    comp.create_folder(home_dir, "AuthManager")
end if

dataFolder = comp.File(home_dir+"/AuthManager")

dataArr = []

for data in dataFolder.get_files
    
    if not data.has_permission("r") then continue

    dataArr.push(NAuth.Base64("dec", data.get_content))
end for

addAccount = function()
    clear_screen
    print("Auth Manager")
    print("[Note: you can delete entries using /home/user/AuthManager]")
    code = user_input("Enter the auth code: ")

    filename = current_date.replace(" ","").replace("-","").replace(":","")+".auth"

    comp.touch(home_dir+"/AuthManager", filename)

    file = comp.File(home_dir+"/AuthManager/"+filename)
    file.set_content(code)

    dataArr = []

    for data in dataFolder.get_files
        if not data.has_permission("r") then continue

        dataArr.push(NAuth.Base64("dec", data.get_content))
    end for

    menu
end function

menu = function()
    clear_screen
    print("Auth Manager")
    print("[###############]")

    for entry in dataArr
        info = entry.split(":")

        ProgramName = info[0]
        Secret = info[1]
        Identifier = "============"

        if info.len == 3 then
            Identifier = info[1]
            Secret = info[2]
        end if

        AuthCode = NAuth.GetCode(Secret)

        print("["+ProgramName+"]")
        print("<b>"+AuthCode+"</b>")
        print("<i>"+Identifier+"</i>")
        print("[###############]")
    end for

    print("\n0: Refresh\n1: Add account")

    option = user_input("<default=0>: ")

    if option != "1" then
        return menu
    end if

    addAccount
end function

menu
