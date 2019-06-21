const fs = require('fs-extra')
const path = require('path')
const Swagger = require('swagger-client')
const Handlebars = require('handlebars')
const camelCase = require('camelcase')
const beautify = require('js-beautify').js_beautify

function getTemplate (templateData) {
  const templateStr = fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf-8')
  return Handlebars.compile(templateStr)(templateData)
}

/**
 *
 * @param docUrl {String} Swagger json url
 * @param path {String} Absolute output path
 */
function generateFile ({ docUrl, filepath }) {
  Swagger.resolve({ url: docUrl }).then(res => {
    const apis = []
    Object.entries(res.spec.paths).forEach(([path, methodObj]) => {
      Object.entries(methodObj).forEach(([method, { operationId, description }]) => {
        apis.push({
          description,
          path: path.replace('{id}', '${params.id}'),
          name: camelCase(operationId),
          method: method.toUpperCase(),
          hasRequestBody: ['put', 'post'].includes(method),
          hasIdInPath: /{id}/.test(path)
        })
      })
    })
    const result = getTemplate({ apis })
    fs.outputFileSync(filepath, beautify(result, {
      indent_size: 2,
      'preserve-newlines': true
    }))
  })
}

module.exports = generateFile
