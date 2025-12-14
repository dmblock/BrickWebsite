# Arrays and Keys

<Intro>

Whenever we are transforming data into an array of elements and put it in our React tree, we need to make sure to give every element an unique identifier to help React distinguish elements for each render. This page will explain the `key` attribute and how to apply it whenever we need to map data to `React.element`s.

</Intro>

## Rendering Arrays

Arrays require a special function `React.array` to convert an `array<Jsx.element>` to render as `Jsx.element`.



## Keys

Keys help React identify which elements have been changed, added, or removed throughout each render. Keys should be given to elements inside the array to give the elements a stable identity:



The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys:



If you don’t have stable IDs for rendered items, you may use the item index as a key as a last resort:



### Keys Must Only Be Unique Among Siblings

Keys used within arrays should be unique among their siblings. However they don’t need to be globally unique. We can use the same keys when we produce two different arrays:



## Rendering `list` Values

In case you ever want to render a `list` of items, you can do something like this:



We use `List.toArray` to convert our list to an array before creating our `array<React.element>`. Please note that using `list` has performance impact due to extra conversion costs.

99% of the time you'll want to use arrays (seamless interop, faster JS code), but in some cases it might make sense to use a `list` to leverage advanced pattern matching features etc.
# Beyond JSX

<Intro>

JSX is a syntax sugar that allows us to use React components in an HTML like manner. A component needs to adhere to certain interface conventions, otherwise it can't be used in JSX. This section will go into detail on how the JSX transformation works and what React APIs are used underneath.

</Intro>

**Note:** This section requires knowledge about the low level apis for [creating elements](./elements-and-jsx#creating-elements-from-component-functions), such as `React.createElement` or `ReactDOM.createDOMElementVariadic`.

> **Note:** The output shown for the examples on this page assumes your `rescript.json` to be set to `"jsx": { "version": 4, "mode": "classic" }`. We will update it for automatic mode soon.

## Component Types

A plain React component is defined as a `('props) => React.element` function. You can also express a component more efficiently with our shorthand type `React.component<'props>`.

Here are some examples on how to define your own component types (often useful when interoping with existing JS code, or passing around components):



The types above are pretty low level (basically the JS representation of a React component), but since ReScript React has its own ways of defining React components in a more language specific way, let's have a closer look on the anatomy of such a construct.

## JSX Component Interface

A ReScript React component needs to be a (sub-)module with a `make` function and `props` type to be usable in JSX. To make things easier, we provide a `@react.component` decorator to create those functions for you:

<div className="hidden">



</div>



In the expanded output:

- `props`: A generated record type that has fields according to the labeled arguments of the `make` function
- `make`: A converted `make` function that complies to the component interface `(props) => React.element`

### Special Case React.forwardRef

The `@react.component` decorator also works for `React.forwardRef` calls:



As shown in the expanded output above, our decorator desugars the function passed to `React.forwardRef` in the same manner as a typical component `make` function. It also creates a `props` type with an optional `ref` field, so we can use it in our JSX call (`<FancyInput ref=.../>`).

So now that we know how the ReScript React component transformation works, let's have a look on how ReScript transforms our JSX constructs.

## JSX Under the Hood

Whenever we are using JSX with a custom component ("capitalized JSX"), we are actually using `React.createElement` to create a new element. Here is an example of a React component without children:



As you can see, it uses `Friend.make` to call the `React.createElement` API. In case you are providing children, it will use `React.createElementVariadic` instead (which is just a different binding for `React.createElement`):



Note that the `children: React.null` field has no relevance since React will only care about the children array passed as a third argument.

### Dom Elements

"Uncapitalized JSX" expressions are treated as DOM elements and will be converted to `ReactDOM.createDOMElementVariadic` calls:



The same goes for uncapitalized JSX with children:


# Components and Props

<Intro>

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. This page provides an introduction to the idea of components.

</Intro>

## What is a Component?

A React component is a function describing a UI element that receives a `props` object as a parameter (data describing the dynamic parts of the UI) and returns a `React.element`.

The nice thing about this concept is that you can solely focus on the input and output. The component function receives some data and returns some opaque `React.element` that is managed by the React framework to render your UI.

> If you want to know more about the low level details on how a component interface is implemented, refer to the [Beyond JSX](./beyond-jsx) page.

## Component Example

Let's start with a first example to see how a ReScript React component looks like:



**Important:** Always make sure to name your component function `make`.

We've created a `Greeting.res` file that contains a `make` function that doesn't receive any props (the function doesn't receive any parameters), and returns a `React.element` that represents `<div> Hello ReScripters! </div>` in the rendered DOM.

You can also see in the the JS output that the function we created was directly translated into the pure JS version of a ReactJS component. Note how a `<div>` transforms into a `JsxRuntime.jsx("div",...)` call in JavaScript.

## Defining Props

In ReactJS, props are usually described as a single `props` record. In ReScript, we use [labeled arguments](/docs/manual/latest/function#labeled-arguments) to define our props parameters instead. Here's an example:



### Optional Props

We can leverage the full power of labeled arguments to define optional props as well:



**Note:** The `@react.component` attribute implicitly adds the last `()` parameter to our `make` function for us (no need to do it ourselves).

In JSX, you can apply optional props with some special syntax:

<div className="hidden">



</div>



### Special Props `key` and `ref`

You can't define any props called `key` or `ref`. React treats those props differently and the compiler will yield an error whenever you try to define a `~key` or `~ref` argument in your component function.

Check out the corresponding [Arrays and Keys](./arrays-and-keys) and [Forwarding React Refs](./forwarding-refs) sections for more details.

### Handling Invalid Prop Names (e.g. keywords)

Prop names like `type` (as in `<input type="text" />`) aren't syntactically valid; `type` is a reserved keyword in ReScript. Use `<input type_="text" />` instead.

For `aria-*` use camelCasing, e.g., `ariaLabel`. For DOM components, we'll translate it to `aria-label` under the hood.

For `data-*` this is a bit trickier; words with `-` in them aren't valid in ReScript. When you do want to write them, e.g., `<div data-name="click me" />`, check out the [React.cloneElement](./elements-and-jsx#cloning-elements) or [React.createDOMElementVariadic](./elements-and-jsx#creating-dom-elements) section.

## Children Props

In React `props.children` is a special attribute to represent the nested elements within a parent element:



By default, whenever you are passing children like in the expression above, `children` will be treated
as a `React.element`:



Interestingly, it doesn't matter if you are passing just one element, or several, React will always collapse its children to a single `React.element`.

It is also possible to redefine the `children` type as well. Here are some examples:

**Component with a mandatory `string` as children:**



**Component with an optional `React.element` as children:**



**Component that doesn't allow children at all:**



Children props are really tempting to be abused as a way to model hierarchies, e.g. `<List> <ListHeader/> <Item/> </List>` (`List` should only allow `Item` / `ListHeader` elements), but this kind of constraint is hard to enforce because all components end up being a `React.element`, so it would require notorious runtime checking within `List` to verify that all children are in fact of type `Item` or `ListHeader`.

The best way to approach this kind of issue is by using props instead of children, e.g. `<List header="..." items=[{id: "...", text: "..."}]/>`. This way it's easy to type check the constraints, and it also spares component consumers from memorizing and remembering component constraints.

**The best use-case for `children` is to pass down `React.element`s without any semantic order or implementation details!**

## @react decorators

You might've wondered what `@react.component` actually does.
It's a decorator that tells the ReScript compiler to treat the function as a React component, transforming it at the syntax level.

In JavaScript, a React component is just a function that takes props (an object) and returns JSX. In ReScript, props are typically represented as a record type.
The `@react.component` decorator automatically generates that record type and wraps the function for you—so you don't have to.



However, writing it manually like this means you lose the `make` function name, which prevents JSX from working as expected when using the component elsewhere.

Having an uppercased function name also helps distinguish React components from regular functions in [React DevTools](https://react.dev/learn/react-developer-tools).

If you prefer defining your own props record, you can use `@react.componentWithProps`. This gives you full control over the props type while still generating a proper uppercased component.



## Props & Type Inference

The ReScript type system is really good at inferring the prop types just by looking at its prop usage.

For simple cases, well-scoped usage, or experimentation, it's still fine to omit type annotations:



In the example above, `onClick` will be inferred as `ReactEvent.Mouse.t => unit`, `msg` as `string` and `children` as `React.element`. Type inference is especially useful when you just forward values to some smaller (privately scoped) functions.

Even though type inference spares us a lot of keyboard typing, we still recommend to explicitly type your props (just like with any public API) for better type visibility and to prevent confusing type errors.

## Using Components in JSX

Every ReScript component can be used in JSX. For example, if we want to use our `Greeting` component within our `App` component, we can do this:



**Note:** React components are capitalized; primitive DOM elements like `div` or `button` are uncapitalized. More infos on the JSX specifics and code transformations can be found in our [JSX language manual section](/docs/manual/latest/jsx#capitalized-tag).

### Handwritten Components

You don't need to use the `@react.component` decorator to write components that can be used in JSX. Instead you can write the `make` function with type `props` and these will always work as React components. But then you will have the issue with the component name being "make" in the React dev tools.

For example:



More details on the `@react.component` decorator and its generated interface can be found in our [Beyond JSX](./beyond-jsx) page.

## Submodule Components

We can also represent React components as submodules, which makes it very convenient to build more complex UI without the need to create multiple files for each composite component (that's probably only used by the parent component anyways):



The `Button.res` file defined above is now containing a `Label` component, that can also be used by other components, either by writing the fully qualified module name (`<Button.Label title="My Button"/>`) or by using a module alias to shortcut the full qualifier:



## Component Naming

Because components are actually a pair of functions, they have to belong to a module to be used in JSX. It makes sense to use these modules for identification purposes as well. `@react.component` or `@react.componentWithProps` automatically adds the name for you based on the module you are in.



If you need a dynamic name for higher-order components or you would like to set your own name you can use `React.setDisplayName(make, "NameThatShouldBeInDevTools")`.

## Tips & Tricks

- Start with one component file and utilize submodule components as your component grows. Consider splitting up in multiple files when really necessary.
- Keep your directory hierarchy flat. Instead of `article/Header.res` use `ArticleHeader.res` etc. Filenames are unique across the codebase, so filenames tend to be very specific `ArticleUserHeaderCard.res`, which is not necessarily a bad thing, since it clearly expresses the intent of the component within its name, and makes it also very easy to find, match and refactor across the whole codebase.
# Context

<Intro>

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

</Intro>

## Why Context?

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

**Note:** In ReScript, passing down props is way simpler than in TS / JS due to its [JSX prop punning](/docs/manual/latest/jsx#punning) feature and strong type inference, so it's often preferrable to keep it simple and just do props passing. Less magic means more transparency!

## When to Use Context

Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a “theme” prop in order to style the Button component:



Using context, we can avoid passing props through intermediate elements:


# Elements & JSX

<Intro>

Elements are the smallest building blocks of React apps. This page will explain how to handle `React.element`s in your React app with our dedicated JSX syntax.

</Intro>

> **Note:** The output shown for the examples on this page assumes your `rescript.json` to be set to `"jsx": { "version": 4, "mode": "classic" }`. We will update it for automatic mode soon.

## Element Basics

Let's start out by creating our first React element.



The binding `element` and the expression `{React.string("Hello World")}` are both of type `React.element`, the fundamental type for representing React elements within a React application. An element describes what you see on the screen whenever you render your application to the DOM.

Let's say you want to create a function that handles another React element, such as `children`, you can annotate it as `React.element`:



Understanding the definition of a `React.element` is essential since it is heavily used within the React APIs, such as `ReactDOM.Client.Root.render(..., element)`, etc. Be aware that JSX doesn't do any automatic `string` to `React.element` conversion for you (ReScript forces explicit type conversion). For example `<div> Hello World </div>` will not type-check (which is actually a good thing because it's also a huge source for subtle bugs!), you need to convert your `"Hello World"` with the `React.string` function first.

Fortunately our React bindings bring all necessary functionality to represent all relevant data types as `React.element`s.

## Using Elements within JSX

You can compose elements into more complex structures by using JSX:



JSX is the main way to express your React application as a tree of elements.

Sometimes, when doing a lot of interop with existing ReactJS codebases, you'll find yourself in a situation where you can't use JSX syntax due to syntactic restrictions. Check out the [Escape Hatches](#escape-hatches) chapter later on for workarounds.

## Creating Elements

### Creating Elements from `string`, `int`, `float`, `array`

Apart from using JSX to create our React elements or React components, the `React` module offers various functions to create elements from primitive data types:



It also offers `React.array` to represent multiple elements as one single element (useful for rendering a list of data, or passing children):



**Note:** We don't offer a `React.list` function because a `list` value would impose runtime overhead. ReScript cares about clean, idiomatic JS output. If you want to transform a `list` of elements to a single React element, combine the output of `Belt.List.toArray` with `React.array` instead.

### Creating Null Elements

ReScript doesn't allow `element || null` constraints due to it's strongly typed nature. Whenever you are expressing conditionals where a value might, or might not be rendered, you will need the `React.null` constant to represent _Nothingness_:



## Escape Hatches

**Note:** This chapter features low level APIs that are used by JSX itself, and should only be used whenever you hit certain JSX syntax limitations. More infos on the JSX internals can be found in our [Beyond JSX](./beyond-jsx) section.

### Creating Elements from Component Functions

**Note:** Details on components and props will be described in the [next chapter](./components-and-props).

Sometimes it's necessary to pass around component functions to have more control over `React.element` creation. Use the `React.createElement` function to instantiate your elements:



This feature is often used when interacting with existing JS / ReactJS code. In pure ReScript React applications, you would rather pass a function that does the rendering for you (also called a "render prop"):



#### Pass Variadic Children

There is also a `React.createElementVariadic` function, which takes an array of children as a third parameter:



**Note:** Here we are passing a prop `"children": React.null` to satisfy the type checker. React will ignore the children prop in favor of the children array.

This function is mostly used by our JSX transformations, so usually you want to use `React.createElement` and pass a children prop instead.

### Creating DOM Elements

To create DOM elements (`<div>`, `<span>`, etc.), use `ReactDOM.createDOMElementVariadic`:



ReScript can make sure that we are only passing valid dom props. You can find an exhaustive list of all available props in the [JsxDOM](https://github.com/rescript-lang/rescript/blob/3bc159f33a3534280bbc26be88fa37ea2114dafe/jscomp/others/jsxDOM.res#L31) module.

### Cloning Elements

**Note:** This is an escape hatch feature and will only be useful for interoping with existing JS code / libraries.

Sometimes it's required to clone an existing element to set, overwrite or add prop values to a new instance, or if you want to set invalid prop names such as `data-name`. You can use `React.cloneElement` for that:



The feature mentioned above could also replicate `props spreading`, a practise commonly used in ReactJS codebases, but we strongly discourage the usage due to its unsafe nature and its incorrectness (e.g. adding undefined extra props to a component doesn't make sense, and causes hard to find bugs).

In ReScript, we rather pass down required props explicitly to leaf components or use a renderProp instead. We introduced [JSX punning](/docs/manual/latest/jsx#punning) syntax to make the process of passing down props more convenient.
# Events

React lets you add event handlers to your JSX. Event handlers are your own functions that will be triggered in response to interactions like clicking, hovering, focusing form inputs, and so on.

## Capture the input value onChange

Depending on the event handler, the callback function will have a different type.
Due to the dynamic nature of JavaScript, we cannot anticipate the target type on the event.
So, we need a leap of faith to grab the input value as string.


# Extensions of Props

> **Note:** The output shown for the examples on this page assumes your `rescript.json` to be set to `"jsx": { "version": 4, "mode": "classic" }`. We will update it for automatic mode soon.

## Spread props

JSX props spread is supported now, but in a stricter way than in JS.

<div className="hidden">



</div>



Multiple spreads are not allowed:



The spread must be at the first position, followed by other props:



## Shared props

You can control the definition of the `props` type by passing as argument to `@react.component` the body of the type definition of `props`. The main application is sharing a single type definition across several components. Here are a few examples:



This feature can be used when the nominally different components are passed to the prop of `Screen` component in [ReScript React Native Navigation](https://github.com/rescript-react-native/rescript-react-navigation).



This example can't pass the type checker, because the props types of both components are nominally different. You can make the both components having the same props type by passing `screenProps` type as argument to `@react.component`.


# Forwarding Refs

<Intro>

Ref forwarding is a technique for automatically passing a [React.ref](./refs-and-the-dom) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.

</Intro>

## Why Ref Forwarding?

Consider a FancyButton component that renders the native button DOM element:



React components hide their implementation details, including their rendered output. Other components using FancyButton **usually will not need** to obtain a ref to the inner button DOM element. This is good because it prevents components from relying on each other’s DOM structure too much.

Although such encapsulation is desirable for application-level components like `FeedStory` or `Comment`, it can be inconvenient for highly reusable “leaf” components like `FancyButton` or `MyTextInput`. These components tend to be used throughout the application in a similar manner as a regular DOM button and input, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations.

There are currently two strategies on forwarding refs through a component. In ReScript and React we strongly recommend **passing your ref as a prop**, but there is also a dedicated API called `React.forwardRef`.

We will discuss both methods in this document.

## Forward Refs via Props

A `React.ref` can be passed down like any other prop. The component will take care of forwarding the ref to the right DOM element.

**No new concepts to learn!**

In the example below, `FancyInput` defines a prop `inputRef` that will be forwarded to its `input` element:



We use the `ReactDOM.domRef` type to represent our `inputRef`. We pass our ref in the exact same manner as we'd do a DOM `ref` attribute (`<input ref={ReactDOM.Ref.domRef(myRef)} />`).

## [Discouraged] React.forwardRef

**Note:** We discourage this method since it will likely go away at some point, and doesn't yield any obvious advantages over the previously mentioned ref prop passing.

`React.forwardRef` offers a way to "emulate a `ref` prop" within custom components. Internally the component will forward the passed `ref` value to the target DOM element instead.

This is how the previous example would look like with the `React.forwardRef` approach:



**Note:** Our `@react.component` decorator transforms our labeled argument props within our `React.forwardRef` function in the same manner as our classic `make` function.

This way, components using `FancyInput` can get a ref to the underlying `input` DOM node and access it if necessary—just like if they used a DOM `input` directly.

## Note for Component Library Maintainers

**When you start using ref forwarding in a component library, you should treat it as a breaking change and release a new major version of your library**. This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior.
# useContext

<Intro>

Context provides a way to pass data through the component tree without having to pass props down manually at every level. The `useContext` hooks gives access to such Context values.

</Intro>

> **Note:** All the details and rationale on React's context feature can be found in [here](./context).

## Usage



Accepts a `React.Context.t` (the value returned from `React.createContext`) and returns the current context value for that context. The current context value is determined by the value prop of the nearest `<MyContext.Provider>` above the calling component in the tree.

## Examples

### A Simple ThemeProvider


# Build A Custom Hook

<Intro>

React comes with a few fundamental hooks out-of-the-box, such as `React.useState` or `React.useEffect`. Here you will learn how to build your own, higher-level hooks for your React use-cases.

</Intro>

## Why Custom Hooks?

Custom hooks let you extract existing component logic into reusable, separate functions.

Let's go back to a previous example from our [React.useEffect section](./hooks-effect) where we built a component for a chat application that displays a message, indicating whether a friend is online or offline:



Now let’s say that our chat application also has a contact list, and we want to render names of online users with a green color. We could copy and paste similar logic above into our `FriendListItem` component but it wouldn’t be ideal:



Instead, we’d like to share this logic between `FriendStatus` and `FriendListItem`.

Traditionally in React, we’ve had two popular ways to share stateful logic between components: render props and higher-order components. We will now look at how Hooks solve many of the same problems without forcing you to add more components to the tree.

## Extracting a Custom Hook

Usually when we want to share logic between two functions, we extract it to a third function. Both components and Hooks are functions, so this works for them too!

**A custom Hook is a function whose name starts with ”use” and that may call other Hooks.** For example, `useFriendStatus` below is our first custom Hook (we create a new file `FriendStatusHook.res` to encapsulate the `state` type as well):



There’s nothing new inside of it — the logic is copied from the components above. Just like in a component, make sure to only call other Hooks unconditionally at the top level of your custom Hook.

Unlike a React component, a custom Hook doesn’t need to have a specific signature. We can decide what it takes as arguments, and what, if anything, it should return. In other words, it’s just like a normal function. Its name should always start with use so that you can tell at a glance that the rules of Hooks apply to it.

The purpose of our `useFriendStatus` Hook is to subscribe us to a friend’s status. This is why it takes `friendId` as an argument, and returns the online state like `Online`, `Offline` or `Loading`:



Now let’s use our custom Hook.

## Using a Custom Hook

In the beginning, our stated goal was to remove the duplicated logic from the `FriendStatus` and `FriendListItem` components. Both of them want to know the online state of a friend.

Now that we’ve extracted this logic to a useFriendStatus hook, we can just use it:





**Is this code equivalent to the original examples?** Yes, it works in exactly the same way. If you look closely, you’ll notice we didn’t make any changes to the behavior. All we did was to extract some common code between two functions into a separate function. Custom Hooks are a convention that naturally follows from the design of Hooks, rather than a React feature.

**Do I have to name my custom Hooks starting with “use”?** Please do. This convention is very important. Without it, we wouldn’t be able to automatically check for violations of rules of Hooks because we couldn’t tell if a certain function contains calls to Hooks inside of it.

**Do two components using the same Hook share state?** No. Custom Hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value), but every time you use a custom Hook, all state and effects inside of it are fully isolated.

**How does a custom Hook get isolated state?** Each call to a Hook gets isolated state. Because we call useFriendStatus directly, from React’s point of view our component just calls useState and useEffect. And as we learned earlier, we can call useState and useEffect many times in one component, and they will be completely independent.

### Tip: Pass Information Between Hooks

Since Hooks are functions, we can pass information between them.

To illustrate this, we’ll use another component from our hypothetical chat example. This is a chat message recipient picker that displays whether the currently selected friend is online:



We keep the currently chosen friend ID in the `recipientId` state variable, and update it if the user chooses a different friend in the `<select>` picker.

Because the useState Hook call gives us the latest value of the `recipientId` state variable, we can pass it to our custom `FriendStatusHook.useFriendStatus` Hook as an argument:



This lets us know whether the currently selected friend is online. If we pick a different friend and update the `recipientId` state variable, our `FriendStatus.useFriendStatus` Hook will unsubscribe from the previously selected friend, and subscribe to the status of the newly selected one.

## Use Your Imagination

Custom Hooks offer the flexibility of sharing logic. You can write custom Hooks that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more we haven’t considered. What’s more, you can build Hooks that are just as easy to use as React’s built-in features.

Try to resist adding abstraction too early. It's pretty common that components grow pretty big when there is enough stateful logic handling involved. This is normal — don’t feel like you have to immediately split it into Hooks. But we also encourage you to start spotting cases where a custom Hook could hide complex logic behind a simple interface, or help untangle a messy component.
# useEffect

<Intro>

The _Effect_ Hook lets you perform side effects in function components.

</Intro>

## What are Effects?

Common examples for (side) effects are data fetching, setting up a subscription, and manually changing the DOM in React components.

There are two common kinds of side effects in React components: those that don’t require cleanup, and those that do. We'll look into the distinction later on in our examples, but first let's see how the interface looks like.

## Basic Usage



`React.useEffect` receives a function that contains imperative, possibly effectful code, and returns a value `option<unit => unit>` as a potential cleanup function.

A `useEffect` call may receive an additional array of dependencies. The effect function will run whenever one of the provided dependencies has changed. More details on why this is useful [down below](#effect-dependencies).

**Note:** You probably wonder why the `React.useEffect` with only one dependency receives an `array`, while `useEffect`'s with multiple dependencies require a `tuple` (e.g. `(prop1, prop2)`) for the dependency list. That's because a tuple can receive multiple values of different types, whereas an `array` only accepts values of identical types. It's possible to replicate a `useEffect` with multiple dependencies by doing `React.useEffect(fn, [1, 2])`, on other hand the type checker wouldn't allow `React.useEffect(fn, [1, "two"])`.

`React.useEffectOnEveryRender` will run its function after every completed render, while `React.useEffect` will only run the effect on the first render (when the component has mounted).

## Examples

### Effects without Cleanup

Sometimes, we want to run some additional code after React has updated the DOM. Network requests, manual DOM mutations, and logging are common examples of effects that don’t require a cleanup. We say that because we can run them and immediately forget about them.

As an example, let's write a counter component that updates `document.title` on every render:





In case we want to make the effects dependent on `count`, we can just use following `useEffect` call instead:



Now instead of running an effect on every render, it will only run when `count` has a different value than in the render before.

### Effects with Cleanup

Earlier, we looked at how to express side effects that don’t require any cleanup. However, some effects do. For example, we might want to set up a subscription to some external data source. In that case, it is important to clean up so that we don’t introduce a memory leak!

Let's look at an example that gracefully subscribes, and later on unsubscribes from some subscription API:





## Effect Dependencies

In some cases, cleaning up or applying the effect after every render might create a performance problem. Let's look at a concrete example to see what `useEffect` does:



Here, we pass `[count]` to `useEffect` as a dependency. What does this mean? If the `count` is 5, and then our component re-renders with count still equal to 5, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items within the array are the same (5 === 5), React would skip the effect. That’s our optimization.

When we render with count updated to 6, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:



**Important:** If you use this optimization, make sure the array includes all values from the component scope (such as props and state) that change over time and that are used by the effect. Otherwise, your code will reference stale values from previous renders

If you want to run an effect and clean it up only once (on mount and unmount), use `React.useEffect` with an empty dependency array `[]`.

If you are interested in more performance optmization related topics, have a look at the ReactJS [Performance Optimization Docs](https://reactjs.org/docs/hooks-faq.html#performance-optimizations) for more detailed infos.
# Hooks Overview

<Intro>

Hooks are an essential mechanism to introduce and manage state and effects in React components.

</Intro>

## What is a Hook?

In the previous chapters we learned how React components are just a simple function representing UI based on specific prop values. For an application to be useful we still need a way to manipulate those props interactively either via user input or via requests loading in data from a server.

That's where Hooks come in. A Hook is a function that allows us to introduce component state and trigger side-effects for different tasks, such as HTTP requests, direct HTML DOM access, querying window sizes, etc.

In other words: **It allows us to "hook into" React features.**

### Example: The `useState` Hook

Just for a quick look, here is an example of a `Counter` component that allows a user to click a button and increment an `count` value that will immediately be rendered on each button click:



Here we are using the `React.useState` Hook. We call it inside a component function to add some local state to it. React will preserve this state between re-renders. `React.useState` returns a tuple: the current state value (`count`) and a function that lets you update it (`setCount`). You can call this function from an event handler or pass it down to other components to call the function.

The only argument to `React.useState` is a function that returns the initial state (`_ => 0`). In the example above, it is 0 because our counter starts from zero. Note that your state can be any type you want and `ReScript` will make sure to infer the types for you (only make sure to return an initial state that matches your type). The initial state argument is only used during the first render.

This was just a quick example on our first hook usage. We will go into more detail in a dedicated [useState](./hooks-state) section.

## Available Hooks

**Note:** All hooks are part of the `React` module (e.g. `React.useState`).

### Basic Hooks:

- [useState](./hooks-state): Adds local state to your component
- [useEffect](./hooks-effect): Runs side-effectual code within your component
- [useContext](./hooks-context): Gives your component to a React Context value

### Additional Hooks:

- [useReducer](./hooks-reducer): An alternative to `useState`. Uses the state / action / reduce pattern.
  <!-- - [useCallback](./hooks-callback): Returns a memoized callback -->
  <!-- - [useMemo](./hooks-memo): Returns a memoized value -->
- [useRef](./hooks-ref): Returns a mutable React-Ref value
  <!-- - [useImperativeHandle](./hooks-imperative-handle): Customizes the instance value that is exposed to parent components when using `ref` -->
  <!-- - [useLayoutEffect](./hooks-layout-effect): Identical to useEffect, but it fires synchronously after all DOM mutations. -->

## Rules of Hooks

Hooks are just simple functions, but you need to follow _two rules_ when using them. ReScript doesn't enforce those rules within the compiler, so if you really want to enforce correct hooks conventions, you can use an [eslint-plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to check your compiled JS output.

### Rule 1) Only Call Hooks at the Top Level

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls. (If you’re curious, you can check out the in depth explanation in the [ReactJS Hooks docs](https://reactjs.org/docs/hooks-rules.html#explanation))

### Rule 2) Only Call Hooks from React Functions

**Don't call Hooks from regular functions.** Instead, you can:

- ✅ Call Hooks from React function components.
- ✅ Call Hooks from custom Hooks (we’ll learn about them in our [custom hooks](./hooks-custom) section).

By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.
# useReducer

<Intro>

`React.useReducer` helps you express your state in an action / reducer pattern.

</Intro>

## Usage



An alternative to [useState](./hooks-state). Accepts a reducer of type `(state, action) => newState`, and returns the current `state` paired with a `dispatch` function `(action) => unit`.

`React.useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

**Note:** You will notice that the action / reducer pattern works especially well in ReScript due to its [immutable records](/docs/manual/latest/record), [variants](/docs/manual/latest/variant) and [pattern matching](/docs/manual/latest/pattern-matching-destructuring) features for easy expression of your action and state transitions.

## Examples

### Counter Example with `React.useReducer`



> React guarantees that dispatch function identity is stable and won’t change on re-renders. This is why it’s safe to omit from the useEffect or useCallback dependency list.

### Basic Todo List App with More Complex Actions

You can leverage the full power of variants to express actions with data payloads to parametrize your state transitions:



## Lazy Initialization



You can also create the `initialState` lazily. To do this, you can use `React.useReducerWithMapState` and pass an `init` function as the third argument. The initial state will be set to `init(initialState)`.

It lets you extract the logic for calculating the initial state outside the reducer. This is also handy for resetting the state later in response to an action:


# useRef

<Intro>

The `useRef` hooks creates and manages mutable containers inside your React component.

</Intro>

## Usage



`React.useRef` returns a mutable ref object whose `.current` record field is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

Essentially, a `React.ref` is like a "box" that can hold a mutable value in its `.current` record field.

You might be familiar with refs primarily as a way to access the DOM. If you pass a ref object to React with `<div ref={ReactDOM.Ref.domRef(myRef)} />`, React will set its `.current` property to the corresponding DOM node whenever that node changes.

However, `useRef()` is useful for more than the ref attribute. It's handy for keeping any mutable value around similar to how you’d use instance fields in classes.

This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that useRef will give you the same ref object on every render.

Keep in mind that `useRef` doesn’t notify you when its content changes. Mutating the `.current` record field doesn’t cause a re-render. If you want to run some code when React attaches or detaches a ref to a DOM node, you may want to use a [callback ref](./refs-and-the-dom#callback-refs) instead.

More infos on direct DOM manipulation can be found in the [Refs and the DOM](./refs-and-the-dom) section.

## Examples

### Managing Focus for a Text Input



### Using a Callback Ref

Reusing the example from our [Refs and the DOM](./refs-and-the-dom#callback-refs) section:


# useState

<Intro>

`React.useState` returns a stateful value, and a function to update it.

</Intro>

## Usage



During the initial render, the returned state `state` is the same as the value passed as the first argument (initialState).

The `setState` function can be passed down to other components as well, which is useful for e.g. setting the state of a parent component by its children.

## Examples

### Using State for a Text Input



### Passing `setState` to a Child Component

In this example, we are creating a `ThemeContainer` component that manages a `darkmode` boolean state and passes the `setDarkmode` function to a `ControlPanel` component to trigger the state changes.



Note that whenever `setDarkmode` is returning a new value (e.g. switching from `true` -> `false`), it will cause a re-render for `ThemeContainer`'s `className` and the toggle text of its nested `ControlPanel`.
# Import / Export ReactJS

Reusing existing React components in ReScript is straightforward.
This guide will walk you through the steps required to import and use React components within ReScript,
including defining component props and handling various import scenarios.

## Basic Example

To reuse a React component in ReScript, create a new module, specify the component's location, and define its props.



## Importing from Relative Paths

You can import components from relative file paths using the `@module` attribute.  
Use "default" to indicate the default export, or specify a named export if needed.

### Named Export Example



## Defining Props Types

You can define a separate type for your component's props within the module.

### Props Type Example



## Optional Props

To define optional props, use the `?` symbol.



## Extending Built-in DOM Nodes

To accept existing DOM props for a component, extend the `JsxDOM.domProps` type.



In this example `width` and `height` can be set because `JsxDOM.domProps` was spread into `fooProps`.
# Installation

**Requirements:**

- `rescript@11.0` or later
- `react@18.0.0` or later

Add the following dependency to your ReScript project (in case you don't have any project yet, check out the [installation instructions](/docs/manual/latest/installation)):

```
npm install @rescript/react
```

Then add the following setting to your existing `rescript.json`:



**Note:** In case your dependencies are not compatible with version 4 of the ReScript JSX transformation yet, you can use v3 in the same project. Check out the details in [Migrate from v3](/docs/react/latest/migrate-react).

To test your setup, create a new `.res` file in your source directory and add the following code:



Now run `npx rescript` and you should see a successful build.

## Exposed Modules

After a successful installation, `@rescript/react` will make the following modules available in your project's global scope:

- `React`: Bindings to React
- `ReactDOM`: Bindings to the ReactDOM
- `ReactDOMServer`: Bindings to the ReactDOMServer
- `ReactEvent`: Bindings to React's synthetic events
- `ReactDOMStyle`: Bindings to the inline style API
- `RescriptReactRouter`: A simple, yet fully featured router with minimal memory allocations
- `RescriptReactErrorBoundary`: A component which handles errors thrown in its child components gracefully

## Automatic vs. Classic Mode

By default, JSX v4 uses the new JSX runtime (`react/jsx-runtime`) introduced in React 17. This is called "automatic mode", and can also be specified explicitly like this:



To keep using the legacy `React.createElement` API (like with JSX v3), you can activate classic mode instead:


# ReScript & React

ReScript offers first class bindings for [ReactJS](https://react.dev) and is designed and built by people using ReScript and React in large mission critical React codebases. The bindings are compatible with modern React versions (>= v18.0).

The ReScript philosophy is to compile as closely to idiomatic JS code as possible; in the case of ReactJS, we made no exception, so it's not only easy to transfer all the React knowledge to the ReScript platform, but also straightforward to integrate with existing ReactJS codebases and libraries.

All our documented examples can be compiled in our [ReScript Playground](/try) as well.

## Feature Overview

- No Babel plugins required (JSX is part of the language!)
- Comes with all essential React APIs for building production ready apps (`useState`, `useReducer`, `useEffect`, `useRef`,...)
- No component class API (all ReScript & React codebases are built on function components & hooks)
- Strong level of type safety and type inference for component props and state values
- [GenType](/docs/manual/latest/typescript-integration) support for importing / exporting React components in TypeScript codebases

> **This documentation assumes basic knowledge about ReactJS.**
>
> Please note that even though we will cover many basic React concepts, it might still be necessary to have a look at the official [ReactJS](https://react.dev) resources, especially if you are a complete beginner with React.

## Development

- In case you are having any issues or if you want to help us out improving our bindings, check out our [rescript-react GitHub repository](https://github.com/rescript-lang/rescript-react).
- For doc related issues, please go to the [rescript-lang.org repo](https://github.com/rescript-lang/rescript-lang.org).
# Lazy Components

<Intro>

It's good practice to delay loading the JavaScript required to render components you're not actually showing yet. This helps with performance and makes your application load faster.

React ships with an [API for dynamically loading components](https://react.dev/reference/react/lazy#lazy). In this little guide we'll show you how to dynamically load React components in ReScript.

</Intro>

> **Note:** This section requires the latest [@rescript/react](https://github.com/rescript-lang/rescript-react) bindings to be installed (_0.12.0-alpha.2 and above_).

ReScript comes with APIs for doing dynamic imports both for single values and for entire modules. These APIs make dynamically importing React components easy.

Let's look at a small example. First we'll define a simple component:



Now we can dynamically import the `<Title/>` component by passing the result of our dynamic import to `React.lazy_`:



That's all the code we need! The new `<LazyTitle />` component behaves exactly the same as the wrapped `<Title />` component, but will be lazy loaded via React's built-in lazy mechanism.

> You can read more about `import` and dynamic import in ReScript in [this part of the documentation](/docs/manual/latest/import-from-export-to-js#dynamic-import).
# Documentation for LLMs

We adhere to the [llms.txt convention](https://llmstxt.org/) to make documentation accessible to large language models and their applications.

Currently, we have the following files...

- [/docs/react/llms.txt](/llms/react/latest/llms.txt) — a list of the available files for ReScript React.
- [/docs/react/llms-full.txt](/llms/react/latest/llm-full.txt) — complete documentation for ReScript React.
- [/docs/react/llms-small.txt](/llms/react/latest/llm-small.txt) — compressed version of the former, without examples for ReScript React.

...and the language documentation:

- [/docs/manual/llms](/docs/manual/latest/llms) — the LLms documentation for ReScript.

## Notes

- The content is automatically generated from the same source as the official documentation for the specific version
# memo

`React.memo` lets you skip re-rendering a component when its props are unchanged.

Wrap a component in memo to get a memoized version of that component.
This memoized version of your component will usually not be re-rendered when its parent component is re-rendered as long as its props have not changed.

<small>
  But React may still re-render it: memoization is a performance optimization,
  not a guarantee.
</small>



## arePropsEqual

In React, memo can accept an optional argument called "arePropsEqual". This function takes two arguments: the previous props and the new props of the component.
It should return true if the old and new props are the same, meaning the component will produce the same output and behavior with the new props as it did with the old ones.

In ReScript, you can use the `arePropsEqual` function with the `React.memoCustomCompareProps` binding. However, `React.memoCustomCompareProps` cannot be combined with `@react.component`.

To work around this, you can redefine the make binding:



Another approach is to use a custom prop type and remove the `@react.component` annotation.


# Migrate from JSX v3

JSX v4 introduces a new idiomatic record-based representation of components which is incompatible with v3. Because of this, either the entire project or dependencies need to be compiled in v4 mode, or some compatibility features need to be used to mix v3 and v4 in the same project. This page describes how to migrate from v3 to v4.

## Configuration

Remove the existing JSX configuration from `rescript.json`:



Then add the new JSX configuration:



or, to keep using the legacy `React.createElement` API like with JSX v3:



### File-level config

The top-level attribute `@@jsxConfig` is used to update the `jsx` config for the rest of the file (or until the next config update). Only the values mentioned are updated, the others are left unchanged.



### v3 compatible mode

JSX v3 is still available with the latest version of compiler and rescript-react.



To build certain dependencies in v3 compatibility mode, whatever the version used in the root project, use `"v3-dependencies"`. The listed dependencies will be built-in v3 mode, and in addition `-open ReactV3` is added to the compiler options.

## Migration of v3 components

Some components in existing projects are written in a way that is dependent on the v3 internal representation. Here are a few examples of how to convert them to v4.

### `makeProps` does not exist in v4

Rewrite this:



To this:



### React.Context

Rewrite this:



To this:



### React.forwardRef (Discouraged)

Rewrite this:



To this: In v3, there is an inconsistency between `ref` as prop and `ref_` as argument. With JSX v4, `ref` is only allowed as an argument.



### Mangling the prop name

The prop name was mangled automatically in v3, such as `_open` becomes `open` in the generated js code. This is no longer the case in v4 because the internal representation is changed to the record instead object. If you need to mangle the prop name, you can use the `@as` annotation.

Rewrite this:



To this:



### Bindings to JS components with optional props

Previously, you could wrap optional props with an explicit `option` when writing bindings to JS components. This approach functioned only due to an implementation detail of the ppx in JSX 3; it's not how to correctly write bindings to a function with optional arguments.

Rewrite this:



To this:


# Refs and the DOM

<Intro>

Refs provide a way to access DOM nodes or React elements created within your `make` component function.

</Intro>

In the typical React dataflow, [props](./components-and-props) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an `React.element`, or it could be a `Dom.element`. For both of these cases, React provides an escape hatch.

A `React.ref` is defined like this:



> _Note that the `Ref.ref` should not to be confused with the builtin [ref type](/docs/manual/latest/mutation), the language feature that enables mutation._

## When to use Refs

There are a few good use cases for refs:

- Managing state that _should not trigger_ any re-render.
- Managing focus, text selection, or media playback.
- Triggering imperative animations.
- Integrating with third-party DOM libraries.

Avoid using refs for anything that can be done declaratively.

## Creating Refs

A React ref is represented as a `React.ref('value)` type, a container managing a mutable value of type `'value`. You can create this kind of ref with the [React.useRef](./hooks-ref) hook:



The example above defines a binding `clicks` of type `React.ref<int>`. Note how changing the value `clicks.current` doesn't trigger any re-rendering of the component.

## Accessing Refs

When a ref is passed to an element during render, a reference to the node becomes accessible at the current attribute of the ref.



The value of the ref differs depending on the type of the node:

- When the ref attribute is used on an HTML element, the ref passed via `ReactDOM.Ref.domRef` receives the underlying DOM element as its current property (type of `React.ref<Nullable.t<Dom.element>>`)
- In case of interop, when the ref attribute is used on a custom class component (based on JS classes), the ref object receives the mounted instance of the component as its current (not discussed in this document).
- **You may not use the ref attribute on component functions** because they don’t have instances (we don't expose JS classes in ReScript).

Here are some examples:

### Adding a Ref to a DOM Element

This code uses a `React.ref` to store a reference to an `input` DOM node to put focus on a text field when a button was clicked:



A few things happened here, so let's break them down:

- We initialize our `textInput` ref as a `Nullable.null`
- We register our `textInput` ref in our `<input>` element with `ReactDOM.Ref.domRef(textInput)`
- In our `focusInput` function, we need to first verify that our DOM element is set, and then use the `focus` binding to set the focus

React will assign the `current` field with the DOM element when the component mounts, and assign it back to null when it unmounts.

### Refs and Component Functions

In React, you **can't** pass a `ref` attribute to a component function:



The snippet above will not compile and output an error that looks like this: `"Ref cannot be passed as a normal prop. Please use forwardRef API instead."`.

As the error message implies, If you want to allow people to take a ref to your component function, you can use [ref forwarding](./forwarding-refs) (possibly in conjunction with useImperativeHandle) instead.

## Exposing DOM Refs to Parent Components

In rare cases, you might want to have access to a child’s DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

we recommend to use [ref forwarding](./forwarding-refs) for these cases. **Ref forwarding lets components opt into exposing any child component’s ref as their own**. You can find a detailed example of how to expose a child’s DOM node to a parent component in the ref forwarding documentation.

## Callback Refs

React also supports another way to set refs called “callback refs” (`React.Ref.callbackDomRef`), which gives more fine-grain control over when refs are set and unset.

Instead of passing a ref value created by `React.useRef()`, you can pass in a callback function. The function receives the target `Dom.element` as its argument, which can be stored and accessed elsewhere.

**Note:** Usually we'd use `React.Ref.domRef()` to pass a ref value, but for callback refs, we use `React.Ref.callbackDomRef()` instead.

The example below implements a common pattern: using the ref callback to store a reference to a DOM node in an instance property.



React will call the ref callback with the DOM element when the component mounts, and call it with null when it unmounts.

You can pass callback refs between components like you can with object refs that were created with `React.useRef()`.



In the example above, `Parent` passes its ref callback as an `setInputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special ref attribute to the `<input>`. As a result, the `textInput` ref in Parent will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.
# Rendering Elements

<Intro>

In our previous section [React Elements & JSX](./elements-and-jsx) we learned how to create and handle React elements. In this section we will learn how to put our elements into action by rendering them into the DOM.

</Intro>

As we mentioned before, a `React.element` describes what you see on the screen:



Unlike browser DOM elements, React elements are plain objects, and are cheap to create. React DOM takes care of updating the DOM to match the React elements.

## Rendering Elements to the DOM

Let's assume we've got an HTML file that contains a `div` like this:



We call this a “root” DOM node because everything inside it will be managed by React DOM.

Plain React applications usually have a single root DOM node. If you are integrating React into an existing app, you may have as many isolated root DOM nodes as you like.

To render our React application into the `root` div, we need to do two things:

- Find our DOM node with `ReactDOM.querySelector`
- Render our React element to our queried `Dom.element` with `ReactDOM.render`

Here is a full example rendering our application in our `root` div:



React elements are immutable. Once you create an element, you can’t change its children or attributes. An element is like a single frame in a movie: it represents the UI at a certain point in time.

At this point we would need to understand a few more concepts, such as React components and state management to be able to update the rendered elements after the initial `ReactDOM.Client.Root.render`. For now, just imagine your React application as a tree of elements, whereby some elements may get replaced during the lifetime of your application.

React will automatically recognize any element changes and will only apply the DOM updates necessary to bring the DOM to the desired state.
# Router

RescriptReact comes with a router! We've leveraged the language and library features in order to create a router that's:

- The simplest, thinnest possible.
- Easily pluggable anywhere into your existing code.
- Performant and tiny.

## How does it work?

The available methods are listed here:

- `RescriptReactRouter.push(string)`: takes a new path and update the URL.
- `RescriptReactRouter.replace(string)`: like `push`, but replaces the current URL.
- `RescriptReactRouter.watchUrl(f)`: start watching for URL changes. Returns a subscription token. Upon url change, calls the callback and passes it the `RescriptReactRouter.url` record.
- `RescriptReactRouter.unwatchUrl(watcherID)`: stop watching for URL changes.
- `RescriptReactRouter.dangerouslyGetInitialUrl()`: get `url` record outside of `watchUrl`. Described later.
- `RescriptReactRouter.useUrl(~serverUrl)`: returns the `url` record inside a component.

> If you want to know more about the low level details on how the router interface is implemented, refer to the [RescriptReactRouter implementation](https://github.com/rescript-lang/rescript-react/blob/master/src/RescriptReactRouter.res).

## Match a Route

_There's no API_! `watchUrl` gives you back a `url` record of the following shape:



So the url `www.hello.com/book/10/edit?name=Jane#author` is given back as:



## Basic Example

Let's start with a first example to see how a ReScript React Router looks like:



## Directly Get a Route

In one specific occasion, you might want to take hold of a `url` record outside of `watchUrl`. For example, if you've put `watchUrl` inside a component's `didMount` so that a URL change triggers a component state change, you might also want the initial state to be dictated by the URL.

In other words, you'd like to read from the `url` record once at the beginning of your app logic. We expose `dangerouslyGetInitialUrl()` for this purpose.

Note: the reason why we label it as "dangerous" is to remind you not to read this `url` in any arbitrary component's e.g. `render`, since that information might be out of date if said component doesn't also contain a `watchUrl` subscription that re-renders the component when the URL changes. Aka, please only use `dangerouslyGetInitialUrl` alongside `watchUrl`.

## Push a New Route

From anywhere in your app, just call e.g. `RescriptReactRouter.push("/books/10/edit#validated")`. This will trigger a URL change (without a page refresh) and `watchUrl`'s callback will be called again.

We might provide better facilities for typed routing + payload carrying in the future!

Note: because of browser limitations, changing the URL through JavaScript (aka pushState) cannot be detected. The solution is to change the URL then fire a "popState" event. This is what Router.push does, and what the event watchUrl listens to.
So if, for whatever reason (e.g. incremental migration), you want to update the URL outside of `RescriptReactRouter.push`, just do `window.dispatchEvent(new Event('popState'))`.

## Design Decisions

We always strive to lower the performance and learning overhead in RescriptReact, and our router design's no different. The entire implementation, barring browser features detection, is around 20 lines. The design might seem obvious in retrospect, but to arrive here, we had to dig back into ReactJS internals & future proposals to make sure we understood the state update mechanisms, the future context proposal, lifecycle ordering, etc. and reject some bad API designs along the way. It's nice to arrive at such an obvious solution!

The API also doesn't dictate whether matching on a route should return a component, a state update, or a side-effect. Flexible enough to slip into existing apps.

Performance-wise, a JavaScript-like API tends to use a JS object of route string -> callback. We eschewed that in favor of pattern-matching, since the latter in Rescript does not allocate memory, and is compiled to a fast jump table in C++ (through the JS JIT). In fact, the only allocation in the router matching is the creation of the url record!
# Server Components

ReScript allows you to create server components as described in [React 19](https://react.dev/reference/rsc/server-components).

## Server Functions

To mark a file exposing functions as [Server Functions](https://react.dev/reference/rsc/server-functions),  
you can use the `@@directive("'use server'")` tag.



**Warning:** It is recommended to use an interface file here, to ensure only the functions you want to expose are exposed.



`myHelper` will remain unexported with this change.

## Server Components

[Server components](https://react.dev/reference/rsc/server-components) can be async.



A server function can be inlined in a server component and passed as prop to a client component.



**Note** that when decorating the function with `@directive("'use server'")`, we use a single `@`, where to annotate an entire file we use `@@directive("'use server'")`.

## Client Components

[Client components](https://react.dev/reference/rsc/use-client) should use the `@@directive("'use client'")` attribute.


# Styling

React comes with builtin support for inline styles, but there are also a number of third party libraries for styling React components. You might be comfortable with a specific setup, like:

- Global CSS / CSS modules
- CSS utility libraries (`tailwindcss`, `tachyons`, `bootstrap` etc.)
- CSS-in-JS (`styled-components`, `emotion`, etc.)

If they work in JS then they almost certainly work in ReScript. In the next few sections, we've shared some ideas for working with popular libraries. If you're interested in working with one you don't see here, search the [package index](https://rescript-lang.org/packages) or post in [the forum](https://forum.rescript-lang.org).

## Inline Styles

This is the most basic form of styling, coming straight from the 90s. You can apply a `style` attribute to any DOM element with our `ReactDOM.Style.make` API:



It's a [labeled](/docs/manual/latest/function#labeled-arguments) (therefore typed) function call that maps to the familiar style object `{color: '#444444', fontSize: '68px'}`. For every CSS attribute in the CSS specfication, there is a camelCased label in our `make` function.

**Note** that `make` returns an opaque `ReactDOM.Style.t` type that you can't read into. We also expose a `ReactDOM.Style.combine` that takes in two `style`s and combine them.

### Escape Hatch: `unsafeAddProp`

The above `Style.make` API will safely type check every style field! However, we might have missed some more esoteric fields. If that's the case, the type system will tell you that the field you're trying to add doesn't exist. To remediate this, we're exposing a `ReactDOM.Style.unsafeAddProp` to dangerously add a field to a style:



## Global CSS

Use a `%%raw` expression to import CSS files within your ReScript / React component code:



## CSS Modules

[CSS modules](https://github.com/css-modules/css-modules) can be imported like any other JS module. The imported value is a JS object, with attributes equivalent to each classname defined in the CSS file.

As an example, let's say we have a CSS module like this:



We now need to create a module binding that imports our styles as a JS object:



**Note:** `{..}` is an open [JS object type](/docs/manual/latest/object#type-declaration), which means the type checker will not type check correct classname usage. If you want to enforce compiler errors, replace `{..}` with a concrete JS object type, such as `{"root": string}`.

## CSS Utility Libraries

### Tailwind

CSS utility libraries like [TailwindCSS](https://tailwindcss.com) usually require some globally imported CSS.

First, create your TailwindCSS main entrypoint file:



Then, import your `main.css` file in your ReScript / React application:



Utilize ReScript's pattern matching and string interpolations to combine different classnames:



> **Hint:** `rescript-lang.org` actually uses TailwindCSS under the hood! Check out our [codebase](https://github.com/rescript-lang/rescript-lang.org) to get some more inspiration on usage patterns.

## CSS-in-JS

There's no way we could recommend a definitive CSS-in-JS workflow, since there are many different approaches on how to bind to CSS-in-JS libraries (going from simple to very advanced).

For demonstration purposes, let's create some simple bindings to e.g. [`emotion`](https://emotion.sh/docs/introduction) (as described [here](https://github.com/bloodyowl/rescript-react-starter-kit/blob/eca7055c59ba578b2d1994fc928d8f541a423e74/src/shared/Emotion.res)):



This will give you straight-forward access to `emotion`'s apis. Here's how you'd use them in your app code:



You can also use submodules to organize your styles more easily:



Please note that this approach will not check for invalid css attribute names. If you e.g. want to make sure that only valid CSS attributes are being passed, you could define your `css` function like this as well:



Here we used the already existing `React.Style.t` type to enforce valid CSS attribute names.
Last but not least, you can also bind to functions that let you use raw CSS directly:



Please keep in mind that there's a spectrum on how type-safe an API can be (while being more / less complex to handle), so choose a solution that fits to your team's needs.