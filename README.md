# walton-backend-assessment
## Environment setup
1. clone the repo: https://github.com/Billal-Hossen/walton-backend-assessment
2. Add . env like envsample file
3. npm install 
4. npm run dev

## Used Technology
1. Nodejs
2. Expresjs
3. GraphQL
4. Mongodb
5. Mongoose and etc.



## CRUD operation
1. craete category:
   1. name is required
   2. check duplicate name before create category
   3. first create category with name and active status. if we ant to create it's sub category just use parentId is input . Here active stattus default value false. Using this way we can create multi level categories.
2. get categories query:
   1.Firstly try to find by parentId. if not find category than check parentId equal null. if not get category than check by categoryId
3. update Category:
   1. Using this mutation can update category.Also can activate and deactivate sub category.(if have)
4. deactivate category mutation:
   1.Only can deactivate category and it's sub category.(if have)
5. delete Category mutation:
   1. Using this mutation can  delete category and it's sub category(if have).
