export const RouteIndex='/'
export const RouteSignin='/sign-in'
export const RouteSignup='/sign-up'
export const RouteProfile='/profile'
export const RouteCategoryDetails='/categories'
export const RouteAddCategory='/category/add'
export const RouteEditCategory=(category_id)=>{
    if(category_id){
        return `/category/edit/${category_id}`
    }else{
        return `/category/edit/:category_id`
    }

}

export const RouteBlog='/blogs'
export const RouteBlogAdd='/blogs/add'
export const RouteBlogEdit=(blogid)=>{
    if(blogid){
        return `/blog/edit/${blogid}`
    }else{
        return `/blog/edit/:blogid`
    }

}

export const RouteBlogDetails=(category,blog)=>{
    if(!category || !blog){
        return `/blog/:category/:blog`
    }else{
        return `/blog/${category}/${blog}`
    }
}

export const RouteCategoryBlogs=(categoryId)=>{
    if(categoryId){
        return `/category/${categoryId}`
    }else{
        return `/category/:categoryId`
    }
}
