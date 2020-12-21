const AWS = require("aws-sdk")
const ssm = new AWS.SSM({ region: "us-east-1" })

const getParameter = async (parameter) => {
  console.log(`getParameter called for /bungie-api-client/${parameter}`)
  const params = {
    Name: `/bungie-api-client/${parameter}`,
    WithDecryption: true
  }
  const response = await ssm.getParameter(params).promise()
  const value = response.Parameter.Value
  return value
}

module.exports.getParameters = async () => {
  console.log("getParameters called")
  const params = {
    Path: "/bungie-api-client/",
    Recursive: false,
    WithDecryption: true
  }
  const { Parameters: parameters } = await ssm.getParametersByPath(params).promise()
  const formattedParameters = {}

  for (const parameter of parameters) {
    const fullName = parameter.Name
    const endOfPathIndex = fullName.indexOf(params.Path) + params.Path.length
    const name = fullName.substring(endOfPathIndex)
    const value = parameter.Value
    formattedParameters[name] = value
  }
  return formattedParameters
}

module.exports.setParameter = async (key, value) => {
  console.log("setParameter called")
  const params = {
    Name: `/bungie-api-client/${key}`,
    Value: value.toString(),
    DataType: "text",
    Overwrite: true,
    Tier: "Standard",
    Type: "SecureString"
  }
  await ssm.putParameter(params).promise()
  let currentValue = getParameter(key)
  while (currentValue !== value.toString()) {
    currentValue = await getParameter(key)
  }
}
