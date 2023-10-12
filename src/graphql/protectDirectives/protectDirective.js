import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { defaultFieldResolver } from 'graphql'
import _ from 'lodash'


export function protectDirective(directiveName = 'protect') {
    const typeDirectiveArgumentMaps = {}

    return {
        protectDirectiveTransformer: (schema) =>
            mapSchema(schema, {
                [MapperKind.TYPE]: (type) => {
                    const protectDirective = _.head(getDirective(schema, type, directiveName))
                    if (protectDirective) {
                        typeDirectiveArgumentMaps[type.name] = protectDirective
                    }
                    return undefined
                },
                [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
                    const protectDirective =
                        _.head(getDirective(schema, fieldConfig, directiveName)) ?? typeDirectiveArgumentMaps[typeName]

                    if (_.size(protectDirective)) {
                        const { roles = [] } = protectDirective

                        if (roles) {
                            const { resolve = defaultFieldResolver } = fieldConfig
                            fieldConfig.resolve = async function (source, args, context, info) {
                                // Have to check user roles here
                                console.log({ context })

                                return resolve(source, args, context, info)
                            }
                            return fieldConfig
                        }
                    }
                }
            })
    }
}
