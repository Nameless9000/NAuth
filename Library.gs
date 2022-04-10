//// SHA256 Port by Finko42 (https://github.com/Finko42/GreyHack/blob/main/Hash%20Functions/sha256.src) \\\\
SHA256 = function(input)

	Blocks = [[0]]
	i=0
	e=0
	while i < input.len
		e=4
		while e > 0 and input.hasIndex(i)
			e=e-1
			Blocks[-1][-1] = Blocks[-1][-1] + code(input[i])*256^e
			i=i+1
		end while
		if e == 0 then
			if Blocks[-1].len == 16 then Blocks = Blocks + [[0]] else Blocks[-1] = Blocks[-1] + [0]
		end if
	end while
	
	if e > 0 then
		Blocks[-1][-1] = Blocks[-1][-1] + (2147483648/256^(4-e))
	else
		Blocks[-1][-1] = 2147483648
	end if
	
	if Blocks[-1].len == 16 then Blocks = Blocks + [[0]]
	while Blocks[-1].len != 15
		Blocks[-1] = Blocks[-1] + [0]
	end while
	
	Blocks[-1] = Blocks[-1] + [input.len*8]
	
	add = function(a, b)
		return (a + b) % 4294967296
	end function
	
	XOR = function(a, b)
		return bitwise("^", floor(a/65536), floor(b/65536))*65536+bitwise("^", a%65536, b%65536)
	end function
	
	AND = function(a, b)
		return bitwise("&", floor(a/65536), floor(b/65536))*65536+bitwise("&", a%65536, b%65536)
	end function
	
	OR = function(a, b)
		return bitwise("|", floor(a/65536), floor(b/65536))*65536+bitwise("|", a%65536, b%65536)
	end function
	
	NOT = function(n)
		return 4294967295-n
	end function
	
	Ch = function(x, y, z)
		return OR(AND(x, y), AND(NOT(x), z))
	end function
	
	Maj = function(x, y, z)
		return OR(OR(AND(x, y), AND(x, z)), AND(y, z))
	end function
	
	shr = function(n, shifts)
		return floor(n/2^shifts)
	end function
	
	rotr = function(n, rots)
		rots = 2^rots
		return (n % rots) * (4294967296/rots) + floor(n/rots)
	end function
	
	sigma0 = function(n)
		return XOR(XOR(rotr(n, 7), rotr(n, 18)), shr(n, 3))
	end function
	
	sigma1 = function(n)
		return XOR(XOR(rotr(n, 17), rotr(n, 19)), shr(n, 10))
	end function
	
	SIGMA0 = function(n)
		return XOR(XOR(rotr(n, 2), rotr(n, 13)), rotr(n, 22))
	end function
	
	SIGMA1 = function(n)
		return XOR(XOR(rotr(n, 6), rotr(n, 11)), rotr(n, 25))
	end function
	
	K = []
	K = K + [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221]
	K = K + [3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580]
	K = K + [3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986]
	K = K + [2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895]
	K = K + [666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037]
	K = K + [2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344]
	K = K + [430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779]
	K = K + [1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
	
	H = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]
	
	for Block in Blocks
		W = Block[0:]
		
		for i in range(16, 63)
			W = W + [add(add(add(sigma1(W[i-2]), W[i-7]), sigma0(W[i-15])), W[i-16])]
		end for
		
		a = H[0]
		b = H[1]
		c = H[2]
		d = H[3]
		e = H[4]
		f = H[5]
		g = H[6]
		h = H[7]
		
		for i in range(0, 63)
			T1 = add(add(add(add(SIGMA1(e), Ch(e, f, g)), h), K[i]), W[i])
			T2 = add(SIGMA0(a), Maj(a, b, c))
			h = g
			g = f
			f = e
			e = add(d, T1)
			d = c
			c = b
			b = a
			a = add(T1, T2)
		end for
		H[0] = add(a, H[0])
		H[1] = add(b, H[1])
		H[2] = add(c, H[2])
		H[3] = add(d, H[3])
		H[4] = add(e, H[4])
		H[5] = add(f, H[5])
		H[6] = add(g, H[6])
		H[7] = add(h, H[7])
	end for
	
	hexTable = "0123456789abcdef"
	hash = ""
	for i in H.indexes
		for j in range(7)
			hash = hash + hexTable[floor(H[i]/16^j) % 16]
		end for
	end for
	return hash
end function
//// SHA256 Port by Finko42 (https://github.com/Finko42/GreyHack/blob/main/Hash%20Functions/sha256.src) \\\\

//// Base64 Port by Kjølnyr#2146 (198861674424303616) \\\\
band=function(x,y)  
    return bitwise("&",x,y) 
end function
bshl=function(x,y)
    return bitwise("<<",x,y)
end function
bushr=function(x,y)
    return bitwise(">>>",x,y)
end function

alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
Ox3f = 63
Oxff = 255

b64encode=function(inp)
    i=0
    b64e=""
    p=""
    c=inp.len%3
    if c>0 then
        for _ in range(1,c-1)
            p=p+"="
            inp.push(0)
        end for
    end if
    while i<inp.len-1
        n=bshl(inp[i],16)+bshl(inp[i+1],8)+inp[i+2]
        n=[band(bushr(n,18),Ox3f),band(bushr(n,12),Ox3f),band(bushr(n,6),Ox3f),band(n,Ox3f)]
        b64e=b64e+alph[n[0]]+alph[n[1]]+alph[n[2]]+alph[n[3]]
        i=i+3
    end while
    return b64e[:b64e.len-p.len]+p
end function

b64decode=function(inp)
    b64d=[]
    p=""
    for i in range(inp.len-2,inp.len-1)
        if inp[i]=="=" then p=p+"A"
    end for
    inp=inp[:inp.len-p.len]+p
    i=0
    while i<inp.len
        n=bshl(alph.indexOf(inp[i]),18)+bshl(alph.indexOf(inp[i+1]),12)+bshl(alph.indexOf(inp[i+2]),6)+alph.indexOf(inp[i+3])
        b64d=b64d+[band(bushr(n,16),Oxff),band(bushr(n,8),Oxff),band(n,Oxff)]
        i=i+4
    end while    
    return b64d[:b64d.len-p.len]
end function
//// Base64 Port by Kjølnyr#2146 (198861674424303616) \\\\

NAuthLibrary = {}

NAuthLibrary.GetTick = function()
    return floor(current_date.remove(" ").remove("-").remove("-").remove(":").val/6)
end function

NAuthLibrary.Base64 = function(option, str)
    if option == "dec" then
        dec = b64decode(str)
        plain=""
        for i in dec
            plain = plain + char(i)
        end for

        return plain
    else if option == "enc" then
        lst=[]
        for c in str
            lst.push(c.code)
        end for

        return b64encode(lst)
    end if
end function

// 512 bits
NAuthLibrary.BLOCK_SIZE = 64

NAuthLibrary.Hash = function(message)
    return SHA256(message)
end function

number_to_bin = function(x)
    ret=""
    while x!=1 and x!=0
        ret=str(x%2) + ret
        x=floor(x/2)
    end while
    ret=str(x) + ret
    return ret
end function

string_to_bin = function(str)
    output = ""
    for cha in str
        output = output + number_to_bin(cha.code)
    end for
    return output.trim
end function

string_xor = function(s1, s2)
	if s1.len != s2.len then exit("HMAC Error:strings must be of equal length")

	buf = []
	for i in range(s1.len)
		buf.push(bitwise("^", s1[i-1].code, s2[i-1].code))
    end for

	return buf.join("")
end function

NAuthLibrary.HMAC = function(key, message)
    if key.len > self.BLOCK_SIZE then
        key = self.Hash(key)
    end if

    key = key + "0"*(self.BLOCK_SIZE - key.len)

    opad = string_xor(key, "\"*self.BLOCK_SIZE)
    ipad = string_xor(key, "6"*self.BLOCK_SIZE)

	return self.Hash(opad + self.Hash(ipad + message))
end function

hexconvd = function(x)
    if typeof(x.to_int) == "number" then return x.to_int
    x=x.upper
    return x.code-55
end function

hexToDec = function(s)
    output = ""
    for cha in s
        output=output+hexconvd(cha)
    end for
    return output
end function

NAuthLibrary.HTOP = function(key, counter, length)
    hash = self.HMAC(key, counter)

    offset = hexconvd(hash[hash.len-1])

    hashArr = []

    for i in range(1,hash.len,2)
        hashArr.push(hash[i-1]+hash[i])
    end for

    truncatedHash = slice(hashArr,offset,offset+4)

    code = ""

    for byte in truncatedHash
        code = code + hexToDec(byte) 
    end for

    code = str(code.val % (10^length))

    code = code + "0"*(length-code.len)

    return code
end function

NAuthLibrary.GetCode = function(secret)
    counter = self.GetTick
    return NAuthLibrary.HTOP(secret, counter, 6)
end function

NAuthLibrary.GenerateSecret = function(ProgramName, Identifier)
    random = ""

    for i in range(1,15)
        random = random + char(floor(rnd * 93) + 33)
    end for

    random = md5(random)[:25].upper

    secret = ProgramName
    if Identifier then
        secret = secret + ":" + Identifier
    end if
    secret = secret + ":" + random

    return {"secret":random, "code":self.Base64("enc", secret)}
end function

return NAuthLibrary
