function _1(md){return(
md`# CS 279 Todo App with D3`
)}

function _2(md){return(
md`Built with D3.js 
`
)}

function _3(html,d3,store,toggleTodo,VisibilityFilters,setVisibilityFilter,addTodo,ActionCreators)
{
  let wrapper = html`<div class="wrapper">
    <div>
        <input type="text" class="text" size="10">
    </div>
    <div>
        <input type="button" class="undo" value="undo">
        <input type="button" class="add" value="add">
    </div>
    <div class=visibilityFilterBoxDiv></div>
    <div class=todoList></div>
  </div>`
  
  function updateData() {
    
    // update selection
    const item = d3.select('.todoList')
      .selectAll('.item')
      .data(store.getState().todos.present.filter(todo => {
        switch (store.getState().visibilityFilter) {
          case 'SHOW_ALL':
            return todo
          case 'SHOW_COMPLETED':
            return todo.completed === true
          case 'SHOW_ACIVE':
            return todo.completed === false
          default:
            console.warn('Unexpected visibilityFilter state')
            return todo
        }
      }), d => d.index)
    
    
    // update selection checkboxes
    const updateItemBox = item.select('.itemBox')
        
    // enter selection
    const itemEnter = item.enter()
      .append('div')
      .attr('class', d => `item ${d.text}`)
      .style('text-align', 'center')
      .style('font-family', 'monospace')

    // enter selection checkboxes + merge with update checkboxes
    const itemBox = itemEnter.append('input')
      .attr('class', 'itemBox')
      .attr('type', 'checkbox')
      .merge(updateItemBox)
        .each(function(d){
          if (d.completed) {
            d3.select(this).attr('checked', true)
          } else {
            d3.select(this).attr('checked', null)
          }
        })
        .on('click', d => {
          store.dispatch(toggleTodo(d.index))
          updateData()
        })
    
    // enter selection text
    const itemText = itemEnter.append('label')
      .attr('class', 'itemText')
      .attr('for', d => d.text)
      .text(d => d.text)

    // exit selection
    const itemExit = item.exit().remove()
  }
    
  // Use D3 to draw and update the UI
  const visibilityFilterBoxes = d3.select(wrapper)
    .select('.visibilityFilterBoxDiv')
    .selectAll('.visibilityFilters')
    .data(Object.values(VisibilityFilters))
    .join('div')

  // After a user update happens, first reflect the change in variable state, then update UI 
  const visibilityCheckboxes = visibilityFilterBoxes.append('input')
    .attr('class', 'visibilityCheckboxes')
    .attr('type', 'radio')
    .attr('name', 'visibilityCheckboxes')
    .attr('id', d => d)
    .attr('value', d => d)
    .on('click', d => {
      store.dispatch(setVisibilityFilter(d))
      updateData()
    })
    .each(function(d) {
      if (store.getState().visibilityFilter === d) d3.select(this).attr('checked', true)
    })
  
  const visibilityLabels = visibilityFilterBoxes.append('label')
    .attr('class', 'visibilityLabels')
    .attr('for', d => d)
    .text(d => d.charAt(0) + d.replace('_', ' ').toLowerCase().slice(1))
    .style('font-family', 'Helvetica')

  d3.select(wrapper).select('.text')
    .on('change', function() {
      const index = store.getState().todos.present.length
      store.dispatch(addTodo(this.value, index))
      updateData()
      this.value = ''
    }) 

  const undoButton = d3.select(wrapper).select('.undo')
    .on('click', () => {
      store.dispatch(ActionCreators.undo())
      updateData()
    })

  const addButton = d3.select(wrapper).select('.add')
    .on('click', () => {
      store.dispatch(ActionCreators.add())
      updateData()
    })

  return wrapper
}


function _4(md){return(
md`## Variable declarations`
)}

function _ADD_TODO(){return(
'ADD_TODO'
)}

function _TOGGLE_TODO(){return(
'TOGGLE_TODO'
)}

function _SET_VISIBILITY_FILTER(){return(
'SET_VISIBILITY_FILTER'
)}

function _VisibilityFilters()
{
  return {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACIVE: 'SHOW_ACIVE',
  }
}


function _9(md){return(
md`## Action Creators`
)}

function _addTodo(ADD_TODO){return(
function addTodo(text, index) {
    return { type: ADD_TODO, text, index }
}
)}

function _toggleTodo(TOGGLE_TODO){return(
function toggleTodo(index) {
    return { type: TOGGLE_TODO, index }
}
)}

function _setVisibilityFilter(SET_VISIBILITY_FILTER){return(
function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}
)}

function _13(md){return(
md`## Reducers and Store Creation`
)}

function _initialState(VisibilityFilters)
{
  return {
    visibilityFilter: VisibilityFilters.SHOW_ALL,
    todos: []
  }
}


function _todos(ADD_TODO,TOGGLE_TODO){return(
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false,
                    index: action.index
                }
            ]
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                }
                return todo
            })
        default:
            return state
    }
}
)}

function _undoableTodos(undoable,todos){return(
undoable(todos)
)}

function _visibilityFilter(VisibilityFilters,SET_VISIBILITY_FILTER){return(
function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}
)}

function _todoApp(initialState,visibilityFilter,undoableTodos){return(
function todoApp(state = initialState, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: undoableTodos(state.todos, action),
    }
}
)}

function _store(redux,todoApp){return(
redux.createStore(todoApp)
)}

function _20(md){return(
md`## Libraries`
)}

function _d3(require){return(
require('d3@5')
)}

function _redux(require){return(
require('redux@4')
)}

async function _reduxUndo(require){return(
await require('https://cdn.jsdelivr.net/npm/redux-undo@1.0.0-beta9-9-7/dist/redux-undo.js')
)}

function _24(md){return(
md`### Assigning Redux-Undo functions to variables`
)}

function _undoable(reduxUndo){return(
reduxUndo.default
)}

function _ActionCreators(reduxUndo){return(
reduxUndo.ActionCreators
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["html","d3","store","toggleTodo","VisibilityFilters","setVisibilityFilter","addTodo","ActionCreators"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("ADD_TODO")).define("ADD_TODO", _ADD_TODO);
  main.variable(observer("TOGGLE_TODO")).define("TOGGLE_TODO", _TOGGLE_TODO);
  main.variable(observer("SET_VISIBILITY_FILTER")).define("SET_VISIBILITY_FILTER", _SET_VISIBILITY_FILTER);
  main.variable(observer("VisibilityFilters")).define("VisibilityFilters", _VisibilityFilters);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("addTodo")).define("addTodo", ["ADD_TODO"], _addTodo);
  main.variable(observer("toggleTodo")).define("toggleTodo", ["TOGGLE_TODO"], _toggleTodo);
  main.variable(observer("setVisibilityFilter")).define("setVisibilityFilter", ["SET_VISIBILITY_FILTER"], _setVisibilityFilter);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("initialState")).define("initialState", ["VisibilityFilters"], _initialState);
  main.variable(observer("todos")).define("todos", ["ADD_TODO","TOGGLE_TODO"], _todos);
  main.variable(observer("undoableTodos")).define("undoableTodos", ["undoable","todos"], _undoableTodos);
  main.variable(observer("visibilityFilter")).define("visibilityFilter", ["VisibilityFilters","SET_VISIBILITY_FILTER"], _visibilityFilter);
  main.variable(observer("todoApp")).define("todoApp", ["initialState","visibilityFilter","undoableTodos"], _todoApp);
  main.variable(observer("store")).define("store", ["redux","todoApp"], _store);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("redux")).define("redux", ["require"], _redux);
  main.variable(observer("reduxUndo")).define("reduxUndo", ["require"], _reduxUndo);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("undoable")).define("undoable", ["reduxUndo"], _undoable);
  main.variable(observer("ActionCreators")).define("ActionCreators", ["reduxUndo"], _ActionCreators);
  return main;
}
