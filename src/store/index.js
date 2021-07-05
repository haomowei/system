// 提供数据（集中化管理数据）
const data = [
    {
        id: 1,
        price: 1999,
        name: '小米'
    },
    {
        id: 2,
        price: 999,
        name:'红米'
    }
]
//管理员
const reducer = function(state = data, action) {
    switch (action.type){
        default:
            return state
    }
}
export default reducer