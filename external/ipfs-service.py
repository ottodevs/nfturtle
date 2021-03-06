import requests

# CREATE LIST OF FILES TO UPLOAD
files = {
    "photo1": (open("images/1.png", "rb")),
}

# UPLOAD THE FILES TO IPFS
response = requests.post("http://ipfs.dappnode:5001/api/v0/add", files=files)
p = response.json()
hash = p["Hash"]
print(hash)


# PIN THE CONTENT IN THE IPFS SERVER
params = (("arg", hash),)
response_two = requests.post("http://ipfs.dappnode:5001/api/v0/pin/add", params=params)
print(response_two.text)

# params = (("Type", "direct"),)
# response_three = requests.post("http://ipfs.dappnode:5001/api/v0/pin/ls")
# print(response_three.text)

# retreive
params = (("arg", hash),)
response_three = requests.post(
    "http://ipfs.dappnode:5001/api/v0/block/get", params=params
)
# print(response_three.text)
