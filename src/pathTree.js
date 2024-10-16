/**
 * Traversing a tree of RegExp ordered by inclusivity is more efficient than a similarly ordered array.
 * Calculating if RegExp A is included within RegExp B is damn hard. Instead RegExp will be ordered by manual insertion.
 */
import { Node, getRoot, addChild, breadthFirstTraversal } from './Tree.js';
const WILDCARD = /.*/;
const middlewares = [];
const errorHandlers = [];
const RouteNode = (regExp) => {
    const node = Node();
    node.regExp = regExp;
    node.middlewares = new Set();
    node.errorHandlers = new Set();
    return node;
};
const _getRoute = (node, controls, regExp) => {
    console.log('_getRoute', node);
    if (node.regExp.toString() === regExp.toString())
        controls.stop = true;
};
const getRoute = (root, regExp) => {
    console.log('getRoute', root);
    return breadthFirstTraversal(root, _getRoute, regExp);
};
const _getMiddlewares = (node, controls, path) => {
    if (node.regExp.test(path) === true) {
        middlewares.push(...node.middlewares);
    }
    else {
        controls.skip = true;
    }
};
const getMiddlewares = (root, path) => {
    middlewares.splice(0, middlewares.length);
    breadthFirstTraversal(root, _getMiddlewares, path);
    return middlewares;
};
const _getErrorHandlers = (node, controls, path) => {
    if (node.regExp.test(path) === true) {
        errorHandlers.push(...node.errorHandlers);
    }
    else {
        controls.skip = true;
    }
};
const getErrorHandlers = (root, path) => {
    errorHandlers.splice(0, errorHandlers.length);
    breadthFirstTraversal(root, _getErrorHandlers, path);
    return errorHandlers;
};
const useMiddleware = (parent, regExp, middleware) => {
    console.log('useMiddleware', getRoot(parent));
    let route = getRoute(getRoot(parent), regExp);
    if (!route) {
        route = RouteNode(regExp);
        addChild(parent, route);
    }
    route.middlewares.add(middleware);
};
const useErrorHandler = (parent, regExp, errorHandler) => {
    console.log('useErrorHandler', getRoot(parent));
    let route = getRoute(getRoot(parent), regExp);
    if (!route) {
        route = RouteNode(regExp);
        addChild(parent, route);
    }
    route.errorHandlers.add(errorHandler);
};
export { WILDCARD, RouteNode, getRoute, getMiddlewares, getErrorHandlers, useMiddleware, useErrorHandler };
export default { WILDCARD, RouteNode, getRoute, getMiddlewares, getErrorHandlers, useMiddleware, useErrorHandler };
// const middleware1 = () => {}
// const middleware2 = () => {}
// const errorHandler1 = () => {}
// const errorHandler2 = () => {}
// useMiddleware(/.*/, middleware1)
// useMiddleware(/\/.*/, middleware2)
// useErrorHandler(/.*/, errorHandler1)
// useErrorHandler(/\/.*/, errorHandler2)
// console.log(getMiddlewares('/home'), getErrorHandlers('/home'))
