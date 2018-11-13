/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.inkjs = {})));
}(this, (function (exports) { 'use strict';

	class Path$1{
		constructor(/*polymorphic constructor*/){
			this._isRelative;
			this._components = [];
	    this._componentsString = null;

			if (typeof arguments[0] == 'string'){
				this.componentsString = arguments[0];
			}
			else if (arguments[0] instanceof Component && arguments[1] instanceof Path$1){
				this._components.push(arguments[0]);
				this._components = this._components.concat(arguments[1]._components);
			}
			else if (arguments[0] instanceof Array){
				this._components = this._components.concat(arguments[0]);
				this._isRelative = !!arguments[1];
			}
		}
		get isRelative(){
			return this._isRelative;
		}
		get componentCount(){
			return this._components.length;
		}
		get head(){
			if (this._components.length > 0) {
				return this._components[0];
			} else {
				return null;
			}
		}
		get tail(){
			if (this._components.length >= 2) {
				var tailComps = this._components.slice(1, this._components.length);//careful, the original code uses length-1 here. This is because the second argument of List.GetRange is a number of elements to extract, wherease Array.slice uses an index
				return new Path$1(tailComps);
			}
			else {
				return Path$1.self;
			}
		}
		get length(){
			return this._components.length;
		}
		get lastComponent(){
	    var lastComponentIdx = this._components.length - 1;
			if (lastComponentIdx >= 0) {
				return this._components[lastComponentIdx];
			} else {
				return null;
			}
		}
		get containsNamedComponent(){
			for (var i = 0, l = this.components.length; i < l; i++){
				if (!this.components[i].isIndex){
					return true;
				}
			}
			return false;
		}
		static get self(){
			var path = new Path$1();
			path._isRelative = true;
			return path;
		}

	  GetComponent(index){
	    return this._components[index];
	  }
		PathByAppendingPath(pathToAppend){
			var p = new Path$1();

			var upwardMoves = 0;
			for (var i = 0; i < pathToAppend._components.length; ++i) {
				if (pathToAppend._components[i].isParent) {
					upwardMoves++;
				} else {
					break;
				}
			}

			for (var i = 0; i < this._components.length - upwardMoves; ++i) {
				p._components.push(this._components[i]);
			}

			for(var i = upwardMoves; i < pathToAppend._components.length; ++i) {
				p._components.push(pathToAppend._components[i]);
			}

			return p;
		}
		get componentsString(){
			if (this._componentsString == null) {
			this._componentsString = this._components.join(".");
			if (this.isRelative) this._componentsString = "." + this._componentsString;
			}

			return this._componentsString;
		}
		set componentsString(value){
			this._components.length = 0;

			this._componentsString = value;

			if (this._componentsString == null || this._componentsString == '') return;

			// When components start with ".", it indicates a relative path, e.g.
			//   .^.^.hello.5
			// is equivalent to file system style path:
			//  ../../hello/5
			if (this._componentsString[0] == '.') {
				this._isRelative = true;
				this._componentsString = this._componentsString.substring(1);
			}

			var componentStrings = this._componentsString.split('.');
			componentStrings.forEach(str => {
				//we need to distinguish between named components that start with a number, eg "42somewhere", and indexed components
				//the normal parseInt won't do for the detection because it's too relaxed.
				//see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
				if (/^(\-|\+)?([0-9]+|Infinity)$/.test(str)){
					this._components.push(new Component(parseInt(str)));
				}
				else{
					this._components.push(new Component(str));
				}
			});
		}
		toString(){
			return this.componentsString;
		}
		Equals(otherPath){
			if (otherPath == null)
				return false;

			if (otherPath._components.length != this._components.length)
				return false;

			if (otherPath.isRelative != this.isRelative)
				return false;

			//the original code uses SequenceEqual here, so we need to iterate over the components manually.
			for (var i = 0, l = otherPath._components.length; i < l; i++){
				//it's not quite clear whether this test should use Equals or a simple == operator, see https://github.com/y-lohse/inkjs/issues/22
				if (!otherPath._components[i].Equals(this._components[i])) return false;
			}

			return true;
		}
		PathByAppendingComponent (c) {
			var p = new Path$1();
			p._components.push.apply(p._components, this._components);
			p._components.push(c);
			return p;
		}
	}

	class Component{
		constructor(indexOrName){
			if (typeof indexOrName == 'string'){
				this._index = -1;
				this._name = indexOrName;
			}
			else{
				this._index = parseInt(indexOrName);
				this._name = null;
			}
		}
		get index(){
			return this._index;
		}
		get name(){
			return this._name;
		}
		get isIndex(){
			return this.index >= 0;
		}
		get isParent(){
			return this.name == Path$1.parentId;
		}

		static ToParent(){
			return new Component(Path$1.parentId);
		}
		toString(){
			if (this.isIndex) {
				return this.index.toString();
			} else {
				return this.name;
			}
		}
		Equals(otherComp){
			if (otherComp != null && otherComp.isIndex == this.isIndex) {
				if (this.isIndex) {
					return this.index == otherComp.index;
				} else {
					return this.name == otherComp.name;
				}
			}

			return false;
		}
	}

	Path$1.parentId = "^";
	Path$1.Component = Component;

	class Object$1{
		constructor(){
			this.parent = null;
			this._path = null;
		}
		get path(){
			if (this._path == null) {

				if (this.parent == null) {
					this._path = new Path$1();
				} else {
					// Maintain a Stack so that the order of the components
					// is reversed when they're added to the Path.
					// We're iterating up the hierarchy from the leaves/children to the root.
					var comps = [];

					var child = this;
	//				Container container = child.parent as Container;
					var container = child.parent;

					while (container instanceof Container) {

						var namedChild = child;
						if (namedChild.name && namedChild.hasValidName) {
							comps.unshift(new Path$1.Component(namedChild.name));
						} else {
							comps.unshift(new Path$1.Component(container.content.indexOf(child)));
						}

						child = container;
	//					container = container.parent as Container;
						container = container.parent;
					}

					this._path = new Path$1(comps);
				}

			}

			return this._path;
		}
		get rootContentContainer(){
			var ancestor = this;
			while (ancestor.parent) {
				ancestor = ancestor.parent;
			}
			return ancestor;
		}

		ResolvePath(path){
			if (path.isRelative) {
				var nearestContainer = this;

				if (nearestContainer instanceof Container === false) {
					if (this.parent == null) console.warn("Can't resolve relative path because we don't have a parent");

					nearestContainer = this.parent;
					if (nearestContainer.constructor.name !== 'Container') console.warn("Expected parent to be a container");

					//Debug.Assert (path.GetComponent(0).isParent);
					path = path.tail;
				}

				return nearestContainer.ContentAtPath(path);
			} else {
				return this.rootContentContainer.ContentAtPath(path);
			}
		}
		ConvertPathToRelative(globalPath){
			var ownPath = this.path;

			var minPathLength = Math.min(globalPath.componentCount, ownPath.componentCount);
			var lastSharedPathCompIndex = -1;

			for (var i = 0; i < minPathLength; ++i) {
				var ownComp = ownPath.GetComponent(i);
				var otherComp = globalPath.GetComponent(i);

				if (ownComp.Equals(otherComp)) {
					lastSharedPathCompIndex = i;
				} else {
					break;
				}
			}

			// No shared path components, so just use global path
			if (lastSharedPathCompIndex == -1)
				return globalPath;

			var numUpwardsMoves = (ownPath.componentCount-1) - lastSharedPathCompIndex;

			var newPathComps = [];

			for(var up = 0; up < numUpwardsMoves; ++up)
				newPathComps.push(Path$1.Component.ToParent());

			for (var down = lastSharedPathCompIndex + 1; down < globalPath.componentCount; ++down)
				newPathComps.push(globalPath.GetComponent(down));

			var relativePath = new Path$1(newPathComps, true);
			return relativePath;
		}
		CompactPathString(otherPath){
			var globalPathStr = null;
			var relativePathStr = null;

			if (otherPath.isRelative) {
				relativePathStr = otherPath.componentsString;
				globalPathStr = this.path.PathByAppendingPath(otherPath).componentsString;
			}
			else {
				var relativePath = this.ConvertPathToRelative(otherPath);
				relativePathStr = relativePath.componentsString;
				globalPathStr = otherPath.componentsString;
			}

			if (relativePathStr.length < globalPathStr.length)
				return relativePathStr;
			else
				return globalPathStr;
		}
		Copy(){
			throw "Not Implemented";
		}
		//SetCHild works slightly diferently in the js implementation. SInce we can't pass an objets property by reference, we instead pass the object and the property string.
		SetChild(obj, prop, value){
			if (obj[prop])
				obj[prop] = null;

			obj[prop] = value;

			if( obj[prop] )
				obj[prop].parent = this;
		}
	}

	class StringBuilder{
		constructor(str){
			str = (typeof str !== 'undefined') ? str.toString() : '';
			this._string = str;
		}
		get Length(){
			return this._string.length;
		}
		Append(str){
			this._string += str;
		}
		AppendLine(str){
			if (typeof str !== 'undefined') this.Append(str);
			this._string += "\n";
		}
		AppendFormat(format){
			//taken from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
			var args = Array.prototype.slice.call(arguments, 1);
			this._string += format.replace(/{(\d+)}/g, function(match, number){
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		}
		toString(){
			return this._string;
		}
	}

	class InkListItem{
		constructor(fullNameOrOriginName, itemName){
			if (itemName !== undefined){
				this.originName = fullNameOrOriginName;
				this.itemName = itemName;
			}
			else{
				var nameParts = fullNameOrOriginName.toString().split('.');
	            this.originName = nameParts[0];
	            this.itemName = nameParts[1];
			}
		}
		static Null(){
			return new InkListItem(null, null);
		}
		isNull(){
			return this.originName == null && this.itemName == null;
		}
		get fullName(){
			return ((this.originName !== null) ? this.originName : "?") + "." + this.itemName;
		}
		toString(){
			return this.fullname;
		}
		Equals(obj){
			if (obj instanceof InkListItem) {
	//			var otherItem = (InkListItem)obj;
				var otherItem = obj;
				return otherItem.itemName   == this.itemName 
					&& otherItem.originName == this.originName;
			}

			return false;
		}
		//GetHashCode not implemented
		toString(){
			//WARNING: experimental. InkListItem are structs and are used as keys inside hashes. In js, we can't use an object as a key, as the key needs to be a string. C# gets around that with the internal GetHashCode, and the js equivalent to that is toString. So here, toString acts as C#'s GetHashCode
			var originCode = '0';
			var itemCode = (this.itemName) ? this.itemName.toString() : 'null';
			if (this.originName != null)
				originCode = this.originName.toString();
			
			return originCode + "." + itemCode;
		}
	}

	//in C#, rawlists are based on dictionnary; the equivalent of a dictionnary in js is Object, but we can't use that or it will conflate dictionnary items and InkList class properties.
	//instead InkList-js has a special _values property wich contains the actual "Dictionnary", and a few Dictionnary methods are re-implemented on InkList. This also means directly iterating over the InkList won't work as expected. Maybe we can return a proxy if that's required.
	//@TODO: actually we could use a Map for this.
	class InkList {
		constructor(polymorphicArgument, originStory){
			this._keys = {};
			this._values = {};
			this.origins = null;
			this._originNames = null;
			
			//polymorphioc constructor
			if (polymorphicArgument){
				if (polymorphicArgument instanceof InkList){
					var otherList = polymorphicArgument;
					otherList.forEach((kv)=>{
						this.Add(kv.Key, kv.Value);
					});
					
					this._originNames = otherList._originNames;
				}
				else if (typeof polymorphicArgument === 'string'){
					this.SetInitialOriginName(polymorphicArgument);
					
					var def = null;
					if (def = originStory.listDefinitions.TryGetListDefinition(polymorphicArgument, def)){
						this.origins = [def];
					}
					else{
						throw new Error("InkList origin could not be found in story when constructing new list: " + singleOriginListName);
					}
				}
				else if (polymorphicArgument.hasOwnProperty('Key') && polymorphicArgument.hasOwnProperty('Value')){
					var singleElement = polymorphicArgument;
					this.Add(singleElement.Key, singleElement.Value);
				}
			}
		}
		forEach(fn){
			for (var key in this._values){
				fn({
					Key: this._keys[key],
					Value: this._values[key]
				});
			}
		}
		AddItem(itemOrItemName){
			if (itemOrItemName instanceof InkListItem){
				var item = itemOrItemName;
				
				if (item.originName == null) {
						this.AddItem(item.itemName);
						return;
				}

				this.origins.forEach((origin)=>{
					if (origin.name == item.originName) {
							var intVal;
							intVal = origin.TryGetValueForItem(item, intVal);
							if (intVal !== undefined) {
									this.Add(item, intVal);
									return;
							} else {
									throw "Could not add the item " + item + " to this list because it doesn't exist in the original list definition in ink.";
							}
					}
				});

				throw "Failed to add item to list because the item was from a new list definition that wasn't previously known to this list. Only items from previously known lists can be used, so that the int value can be found.";
			}
			else{
				var itemName = itemOrItemName;
				
				var foundListDef = null;

				this.origins.forEach((origin)=>{
					if (origin.ContainsItemWithName(itemName)) {
							if (foundListDef != null) {
									throw "Could not add the item " + itemName + " to this list because it could come from either " + origin.name + " or " + foundListDef.name;
							} else {
									foundListDef = origin;
							}
					}
				});

				if (foundListDef == null)
						throw "Could not add the item " + itemName + " to this list because it isn't known to any list definitions previously associated with this list.";

				var item = new InkListItem(foundListDef.name, itemName);
				var itemVal = foundListDef.ValueForItem(item);
				this.Add(item, itemVal);
			}
		}
		ContainsItemNamed(itemName){
			var contains = false;
			this.forEach(itemWithValue => {
					if (itemWithValue.Key.itemName == itemName) contains = true;
			});
			return contains;
		}
		ContainsKey(key){
			return key in this._values;
		}
		Add(key, value){
			this._keys[key] = key;
			this._values[key] = value;
		}
		Remove(key){
			delete this._values[key];
			delete this._keys[key];
		}
		get Count(){
			return Object.keys(this._values).length;
		}
		get originOfMaxItem(){
			if (this.origins == null) return null;

			var maxOriginName = this.maxItem.Key.originName;
			var result = null;
			this.origins.every(function(origin){
				if (origin.name == maxOriginName){
					result = origin;
					return false;
				}
				else return true;
			});
			
			return result;
		}
		get originNames(){
			if (this.Count > 0) {
				if (this._originNames == null && this.Count > 0)
					this._originNames = [];
				else
					this._originNames.length = 0;

				this.forEach((itemAndValue)=>{
					this._originNames.push(itemAndValue.Key.originName);
				});
			}

			return this._originNames;
		}
		SetInitialOriginName(initialOriginName){
			this._originNames = [initialOriginName];
		}
		SetInitialOriginNames(initialOriginNames){
			if (initialOriginNames == null)
					this._originNames = null;
			else
					this._originNames = initialOriginNames.slice();//store a copy
		}
		get maxItem(){
			var max = {
				Key: null,
				Value: null
			};
			this.forEach(function(kv){
				if (max.Key === null || kv.Value > max.Value)
					max = kv;
			});
			
			return max;
		}
		get minItem(){
			var min = {
				Key: null,
				Value: null
			};
			this.forEach(function(kv){
				if (min.Key === null || kv.Value < min.Value)
					min = kv;
			});
			
			return min;
		}
		get inverse(){
			var list = new InkList();
			if (this.origins != null) {
				this.origins.forEach((origin)=>{
					origin.items.forEach((itemAndValue)=>{
						if (!this.ContainsKey(itemAndValue.Key))
							list.Add(itemAndValue.Key, itemAndValue.Value);
					});
				});
			}
			return list;
		}
		get all(){
			var list = new InkList();
			if (this.origins != null) {
				this.origins.forEach(function(origin){
					origin.items.forEach(function(itemAndValue){
						list.Add(itemAndValue.Key, itemAndValue.Value);
					});
				});
			}
			return list;
		}
		Union(otherList){
			var union = new InkList(this);
			otherList.forEach(function(kv){
				union.Add(kv.Key, kv.Value);
			});
			return union;
		}
		Intersect(otherList){
			var intersection = new InkList();
			this.forEach(function(kv){
				if (otherList.ContainsKey(kv.Key))
					intersection.Add(kv.Key, kv.Value);
			});
			return intersection;
		}
		Without(listToRemove){
			var result = new InkList(this);
			listToRemove.forEach(function(kv){
				result.Remove(kv.Key);
			});
			return result;
		}
		Contains(otherList){
			var contains = true;
			otherList.forEach((kv)=>{
				if (!this.ContainsKey(kv.Key)) contains = false;
			});
			return contains;
		}
		GreaterThan(otherList){
			if (this.Count == 0) return false;
			if (otherList.Count == 0) return true;

			// All greater
			return this.minItem.Value > otherList.maxItem.Value;
		}
		GreaterThanOrEquals(otherList){
			if (this.Count == 0) return false;
			if (otherList.Count == 0) return true;

			return this.minItem.Value >= otherList.minItem.Value
				&& this.maxItem.Value >= otherList.maxItem.Value;
		}
		LessThan(otherList){
			if (otherList.Count == 0) return false;
			if (this.Count == 0) return true;

			return this.maxItem.Value < otherList.minItem.Value;
		}
		LessThanOrEquals(otherList){
			if (otherList.Count == 0) return false;
			if (this.Count == 0) return true;

			return this.maxItem.Value <= otherList.maxItem.Value
				&& this.minItem.Value <= otherList.minItem.Value;
		}
		MaxAsList(){
			if (this.Count > 0)
				return new InkList(this.maxItem);
			else
				return new InkList();
		}
		MinAsList(){
			if (this.Count > 0)
				return new InkList(this.minItem);
			else
				return new InkList();
		}
		Equals(other){
	//		var otherInkList = other as InkList;
			var otherInkList = other;
			if (otherInkList instanceof InkList === false) return false;
			if (otherInkList.Count != this.Count) return false;

			var equals = true;
			this.forEach(function(kv){
				if (!otherInkList.ContainsKey(kv.Key))
					equals = false;
			});

			return equals;
		}
		//GetHashCode not implemented
		toString(){
			var ordered = [];
			this.forEach(function(kv){
				ordered.push(kv);
			});
			ordered = ordered.sort((a, b) => {
				return (a.Value === b.Value) ? 0 : ((a.Value > b.Value) ? 1 : -1);
			});

			var sb = new StringBuilder();
			for (var i = 0; i < ordered.length; i++) {
				if (i > 0)
					sb.Append(", ");

				var item = ordered[i].Key;
				sb.Append(item.itemName);
			}

			return sb.toString();
		}
		//casting a InkList to a Number, for somereason, actually gives a number. This messes up the type detection when creating a Value from a InkList. Returning NaN here prevents that.
		valueOf(){
			return NaN;
		}
	}

	class StoryException extends Error{
		constructor(message) {
			super(message);
			this.useEndLineNumber = false;
			this.message = message;
			this.name = 'StoryException';
		}
	}

	var ValueType = {
		// Used in coersion
		Int: 0,
		Float: 1,
		List: 2,
		String: 3,

		// Not used for coersion described above
		DivertTarget: 4,
		VariablePointer: 5
	};

	class AbstractValue extends Object$1{
		constructor(val){
			super();
			this._valueType;
			this._isTruthy;
			this._valueObject;
		}
		get valueType(){
			return this._valueType;
		}
		get isTruthy(){
			return this._isTruthy;
		}
		get valueObject(){
			return this._valueObject;
		}

		Cast(newType){
			throw "Trying to casting an AbstractValue";
		}
		static Create(val){
			// Implicitly convert bools into ints
			if (typeof val === 'boolean'){
				var b = !!val;
				val = (b) ? 1 : 0;
			}

			if (Number.isInteger(Number(val))) {
				return new IntValue(val);
			} else if (!isNaN(val)) {
				return new FloatValue(val);
			} else if (typeof val === 'string') {
				return new StringValue(val);
			} else if (val instanceof Path$1) {
				return new DivertTargetValue(val);
			} else if (val instanceof InkList) {
				return new ListValue(val);
			}

			return null;
		}
		Copy(val){
			return AbstractValue.Create(val);
		}
		BadCastException (targetType) {
			return new StoryException("Can't cast "+this.valueObject+" from " + this.valueType+" to "+targetType);
		}
	}

	class Value extends AbstractValue{
		constructor(val){
			super();
			this.value = val;
		}
		get value(){
			return this._value;
		}
		set value(value){
			this._value = value;
		}
		get valueObject(){
			return this.value;
		}
		toString(){
			return this.value.toString();
		}
	}

	class IntValue extends Value{
		constructor(val){
			super(val || 0);
			this._valueType = ValueType.Int;
		}
		get isTruthy(){
			return this.value != 0;
		}
		get valueType(){
			return ValueType.Int;
		}

		Cast(newType){
			if (newType == this.valueType) {
				return this;
			}

			if (newType == ValueType.Float) {
				return new FloatValue(parseFloat(this.value));
			}

			if (newType == ValueType.String) {
				return new StringValue("" + this.value);
			}

			throw this.BadCastException(newType);
		}
	}

	class FloatValue extends Value{
		constructor(val){
			super(val || 0.0);
			this._valueType = ValueType.Float;
		}
		get isTruthy(){
			return this._value != 0.0;
		}
		get valueType(){
			return ValueType.Float;
		}

		Cast(newType){
			if (newType == this.valueType) {
				return this;
			}

			if (newType == ValueType.Int) {
				return new IntValue(parseInt(this.value));
			}

			if (newType == ValueType.String) {
				return new StringValue("" + this.value);
			}

			throw this.BadCastException(newType);
		}
	}

	class StringValue extends Value{
		constructor(val){
			super(val || '');
			this._valueType = ValueType.String;

			this._isNewline = (this.value == "\n");
			this._isInlineWhitespace = true;

			// Splitting "" yields [""] which isn't what we want. Thanks JS!
			if( this.value.length > 0 ) {
				this.value.split().every(c => {
					if (c != ' ' && c != '\t'){
						this._isInlineWhitespace = false;
						return false;
					}
		
					return true;
				});
			}
		}
		get valueType(){
			return ValueType.String;
		}
		get isTruthy(){
			return this.value.length > 0;
		}
		get isNewline(){
			return this._isNewline;
		}
		get isInlineWhitespace(){
			return this._isInlineWhitespace;
		}
		get isNonWhitespace(){
			return !this.isNewline && !this.isInlineWhitespace;
		}

		Cast(newType){
			if (newType == this.valueType) {
				return this;
			}

			if (newType == ValueType.Int) {

				var parsedInt;
				if (parsedInt = parseInt(value)) {
					return new IntValue(parsedInt);
				} else {
					return null;
				}
			}

			if (newType == ValueType.Float) {
				var parsedFloat;
				if (parsedFloat = parsedFloat(value)) {
					return new FloatValue(parsedFloat);
				} else {
					return null;
				}
			}

			throw this.BadCastException(newType);
		}
	}

	class DivertTargetValue extends Value{
		constructor(targetPath){
			super(targetPath);

			this._valueType = ValueType.DivertTarget;
		}
		get targetPath(){
			return this.value;
		}
		set targetPath(value){
			this.value = value;
		}
		get isTruthy(){
			throw "Shouldn't be checking the truthiness of a divert target";
		}

		Cast(newType){
			if (newType == this.valueType)
				return this;

			throw this.BadCastException(newType);
		}
		toString(){
			return "DivertTargetValue(" + this.targetPath + ")";
		}
	}

	class VariablePointerValue extends Value{
		constructor(variableName, contextIndex){
			super(variableName);

			this._valueType = ValueType.VariablePointer;
			this.contextIndex = (typeof contextIndex !== 'undefined') ? contextIndex : -1;
		}
		get variableName(){
			return this.value;
		}
		set variableName(value){
			this.value = value;
		}
		get isTruthy(){
			throw "Shouldn't be checking the truthiness of a variable pointer";
		}

		Cast(newType){
			if (newType == this.valueType)
				return this;

			throw this.BadCastException(newType);
		}
		toString(){
			return "VariablePointerValue(" + this.variableName + ")";
		}
		Copy(){
			return new VariablePointerValue(this.variableName, this.contextIndex);
		}
	}

	class ListValue extends Value{
		get valueType(){
			return ValueType.List;
		}
		get isTruthy(){
			var isTruthy = false;
			this.value.forEach(function(kv){
				var listItemIntValue = kv.Value;
				if (listItemIntValue != 0)
					isTruthy = true;
			});
			return isTruthy;
		}
		Cast(newType){
			 if (newType == ValueType.Int) {
				var max = this.value.maxItem;
				if( max.Key.isNull )
					return new IntValue(0);
				else
					return new IntValue(max.Value);
			}

			else if (newType == ValueType.Float) {
				var max = this.value.maxItem;
				if (max.Key.isNull)
					return new FloatValue(0.0);
				else
					return new FloatValue(parseFloat(max.Value));
			}

			else if (newType == ValueType.String) {
				var max = value.maxItem;
				if (max.Key.isNull)
					return new StringValue("");
				else {
					return new StringValue(max.Key.toString());
				}
			}

			if (newType == this.valueType)
				return this;

			throw this.BadCastException(newType);
		}
		constructor(listOrSingleItem, singleValue){
			super(null);

			this._valueType = ValueType.List;

			if (listOrSingleItem instanceof InkList){
				this.value = new InkList(listOrSingleItem);
			}
			else if (listOrSingleItem !== undefined && singleValue !== undefined){
				this.value = new InkList({
					Key: listOrSingleItem,
					Value: singleValue
				});
			}
			else{
				this.value = new InkList();
			}
		}
		static RetainListOriginsForAssignment(oldValue, newValue){
	//		var oldList = oldValue as ListValue;
			var oldList = oldValue;
	//		var newList = newValue as ListValue;
			var newList = newValue;

			// When assigning the emtpy list, try to retain any initial origin names
			if (oldList instanceof ListValue && newList instanceof ListValue && newList.value.Count == 0)
				newList.value.SetInitialOriginNames(oldList.value.originNames);
		}
	}

	class SearchResult{
		constructor(){
			this.obj;
			this.approximate;
		}

		get correctObj(){
			return this.approximate ? null : this.obj;
		}

		get container(){
			return (this.obj instanceof Container) ? this.obj : null;
		}

		copy(){
			var searchResult = new SearchResult();
			searchResult.obj = this.obj;
			searchResult.approximate = this.approximate;

			return searchResult;
		}
	}

	class Container extends Object$1{//also implements INamedContent. Not sure how to do it cleanly in JS.
		constructor(){
			super();
			this.name = '';

			this._content = [];
			this.namedContent = {};

			this.visitsShouldBeCounted = false;
			this.turnIndexShouldBeCounted = false;
			this.countingAtStartOnly = false;

			this.CountFlags = {
				Visits: 1,
				Turns: 2,
				CountStartOnly: 4
			};

			this._pathToFirstLeafContent = null;
		}
		get hasValidName(){
			return this.name != null && this.name.length > 0;
		}
		get content(){
			return this._content;
		}
		set content(value){
			this.AddContent(value);
		}
		get namedOnlyContent(){
			var namedOnlyContentDict = {};

			for (var key in this.namedContent){
				namedOnlyContentDict[key] = this.namedContent[key];
			}

			this.content.forEach(c => {
	//			var named = c as INamedContent;
				var named = c;
				if (named.name && named.hasValidName) {
					delete namedOnlyContentDict[named.name];
				}
			});

			if (Object.keys(namedOnlyContentDict).length == 0)
				namedOnlyContentDict = null;

			return namedOnlyContentDict;
		}
		set namedOnlyContent(value){
			var existingNamedOnly = this.namedOnlyContent;
			if (existingNamedOnly != null) {
				for (var key in existingNamedOnly){
					delete this.namedContent[key];
				}
			}

			if (value == null)
				return;

			for (var key in value){
	//			var named = kvPair.Value as INamedContent;
				var named = value[key];
				if( named.name && typeof named.hasValidName !== 'undefined' )
					this.AddToNamedContentOnly(named);
			}
		}
		get countFlags(){
			var flags = 0;
			if (this.visitsShouldBeCounted)    flags |= this.CountFlags.Visits;
			if (this.turnIndexShouldBeCounted) flags |= this.CountFlags.Turns;
			if (this.countingAtStartOnly)      flags |= this.CountFlags.CountStartOnly;

			// If we're only storing CountStartOnly, it serves no purpose,
			// since it's dependent on the other two to be used at all.
			// (e.g. for setting the fact that *if* a gather or choice's
			// content is counted, then is should only be counter at the start)
			// So this is just an optimisation for storage.
			if (flags == this.CountFlags.CountStartOnly) {
				flags = 0;
			}

			return flags;
		}
		set countFlags(value){
			 var flag = value;
			if ((flag & this.CountFlags.Visits) > 0) this.visitsShouldBeCounted = true;
			if ((flag & this.CountFlags.Turns) > 0)  this.turnIndexShouldBeCounted = true;
			if ((flag & this.CountFlags.CountStartOnly) > 0) this.countingAtStartOnly = true;
		}
		get pathToFirstLeafContent(){
			if( this._pathToFirstLeafContent == null )
				this._pathToFirstLeafContent = this.path.PathByAppendingPath(this.internalPathToFirstLeafContent);

			return this._pathToFirstLeafContent;
		}
		get internalPathToFirstLeafContent(){
			var components = [];
			var container = this;
			while (container instanceof Container) {
				if (container.content.length > 0) {
					components.push(new Path.Component(0));
	//				container = container.content [0] as Container;
					container = container.content[0];
				}
			}
			return new Path(components);
		}

		AddContent(contentObj){
			if (contentObj instanceof Array){
				contentObj.forEach(c => {
					this.AddContent(c);
				});
			}
			else{
				this._content.push(contentObj);

				if (contentObj.parent) {
					throw "content is already in " + contentObj.parent;
				}

				contentObj.parent = this;

				this.TryAddNamedContent(contentObj);
			}
		}
		TryAddNamedContent(contentObj){
			//so here, in the reference implementation, contentObj is casted to an INamedContent
			//but here we use js-style duck typing: if it implements the same props as the interface, we treat it as valid
			if (contentObj.hasValidName && contentObj.name){
				this.AddToNamedContentOnly(contentObj);
			}
		}
		AddToNamedContentOnly(namedContentObj){
			if (namedContentObj instanceof Object$1 === false) console.warn("Can only add Runtime.Objects to a Runtime.Container");
			namedContentObj.parent = this;

			this.namedContent[namedContentObj.name] = namedContentObj;
		}
		ContentAtPath(path, partialPathStart, partialPathLength){
			partialPathStart = (typeof partialPathStart !== 'undefined') ? partialPathStart : 0;
			partialPathLength = (typeof partialPathLength !== 'undefined') ? partialPathLength : path.length;

			var result = new SearchResult();
			result.approximate = false;

			var currentContainer = this;
			var currentObj = this;

			for (var i = partialPathStart; i < partialPathLength; ++i) {
				var comp = path.GetComponent(i);
				if (currentContainer == null) {
					result.approximate = true;
					break;
				}

				var foundObj = currentContainer.ContentWithPathComponent(comp);

				if (foundObj == null) {
					result.approximate = true;
					break;
				}

				currentObj = foundObj;
				currentContainer = (foundObj instanceof Container) ? foundObj : null;
			}

			result.obj = currentObj;

			return result;
		}
		InsertContent(contentObj, index){
			this.content[i] = contentObj;

			if (contentObj.parent) {
				throw "content is already in " + contentObj.parent;
			}

			contentObj.parent = this;

			this.TryAddNamedContent(contentObj);
		}
		AddContentsOfContainer(otherContainer){
			this.content = this.content.concat(otherContainer.content);

			otherContainer.content.forEach(obj => {
				obj.parent = this;
				this.TryAddNamedContent(obj);
			});
		}
		ContentWithPathComponent(component){
			if (component.isIndex) {

				if (component.index >= 0 && component.index < this.content.length) {
					return this.content[component.index];
				}

				// When path is out of range, quietly return nil
				// (useful as we step/increment forwards through content)
				else {
					return null;
				}

			}

			else if (component.isParent) {
				return this.parent;
			}

			else {
				var foundContent = null;
				if (foundContent = this.namedContent[component.name]){
					return foundContent;
				}
				else {
					return null;
				}
			}
		}
		BuildStringOfHierarchy(sb, indentation, pointedObj){
			if (arguments.length == 0){
				var sb = new StringBuilder();
				this.BuildStringOfHierarchy(sb, 0, null);
				return sb.toString();
			}

			function appendIndentation(){
				var spacesPerIndent = 4;
				for(var i = 0; i < spacesPerIndent*indentation; ++i) {
					sb.Append(" ");
				}
			}

			appendIndentation();
			sb.Append("[");

			if (this.hasValidName) {
				sb.AppendFormat(" ({0})", this.name);
			}

			if (this == pointedObj) {
				sb.Append("  <---");
			}

			sb.AppendLine();

			indentation++;

			for (var i = 0; i < this.content.length; ++i) {

				var obj = this.content[i];

				if (obj instanceof Container) {

					var container = obj;

					container.BuildStringOfHierarchy(sb, indentation, pointedObj);

				} else {
					appendIndentation();
					if (obj instanceof StringValue) {
						sb.Append("\"");
						sb.Append(obj.toString().replace("\n", "\\n"));
						sb.Append("\"");
					} else {
						sb.Append(obj.toString());
					}
				}

				if (i != this.content.length - 1) {
					sb.Append(",");
				}

				if ( !(obj instanceof Container) && obj == pointedObj ) {
					sb.Append("  <---");
				}

				sb.AppendLine();
			}


			var onlyNamed = {};

			for (var key in this.namedContent){
				if (this.content.indexOf(this.namedContent[key]) >= 0) {
					continue;
				} else {
					onlyNamed[key] = this.namedContent[key];
				}
			}

			if (Object.keys(onlyNamed).length > 0) {
				appendIndentation();
				sb.AppendLine("-- named: --");

				for (var key in onlyNamed){
					if (!(onlyNamed[key] instanceof Container)) console.warn("Can only print out named Containers");

					var container = onlyNamed[key];
					container.BuildStringOfHierarchy(sb, indentation, pointedObj);
					sb.Append("\n");
				}
			}


			indentation--;

			appendIndentation();
			sb.Append("]");
		}
	}

	class Glue extends Object$1{
		toString(){
			return "Glue";
		}
	}

	class ControlCommand extends Object$1{
		constructor(commandType){
			super();
			this._commandType = (typeof commandType != 'undefined') ? commandType : CommandType.NotSet;
		}
		get commandType(){
			return this._commandType;
		}
		copy(){
			return new ControlCommand(this.commandType);
		}
		toString(){
			return this.commandType.toString();
		}
		static EvalStart(){
			return new ControlCommand(CommandType.EvalStart);
		}
		static EvalOutput(){
			return new ControlCommand(CommandType.EvalOutput);
		}
		static EvalEnd(){
			return new ControlCommand(CommandType.EvalEnd);
		}
		static Duplicate(){
			return new ControlCommand(CommandType.Duplicate);
		}
		static PopEvaluatedValue(){
			return new ControlCommand(CommandType.PopEvaluatedValue);
		}
		static PopFunction(){
			return new ControlCommand(CommandType.PopFunction);
		}
		static PopTunnel(){
			return new ControlCommand(CommandType.PopTunnel);
		}
		static BeginString(){
			return new ControlCommand(CommandType.BeginString);
		}
		static EndString(){
			return new ControlCommand(CommandType.EndString);
		}
		static NoOp(){
			return new ControlCommand(CommandType.NoOp);
		}
		static ChoiceCount(){
			return new ControlCommand(CommandType.ChoiceCount);
		}
		static TurnsSince(){
			return new ControlCommand(CommandType.TurnsSince);
		}
		static ReadCount(){
			return new ControlCommand(CommandType.ReadCount);
		}
		static Random(){
			return new ControlCommand(CommandType.Random);
		}
		static SeedRandom(){
			return new ControlCommand(CommandType.SeedRandom);
		}
		static VisitIndex(){
			return new ControlCommand(CommandType.VisitIndex);
		}
		static SequenceShuffleIndex(){
			return new ControlCommand(CommandType.SequenceShuffleIndex);
		}
		static StartThread(){
			return new ControlCommand(CommandType.StartThread);
		}
		static Done(){
			return new ControlCommand(CommandType.Done);
		}
		static End(){
			return new ControlCommand(CommandType.End);
		}
		static ListFromInt(){
			return new ControlCommand(CommandType.ListFromInt);
		}
		static ListRange(){
			return new ControlCommand(CommandType.ListRange);
		}
	}

	var CommandType = {
		NotSet: -1,
		EvalStart: 0,
		EvalOutput: 1,
		EvalEnd: 2,
		Duplicate: 3,
		PopEvaluatedValue: 4,
		PopFunction: 5,
		PopTunnel: 6,
		BeginString: 7,
		EndString: 8,
		NoOp: 9,
		ChoiceCount: 10,
		TurnsSince: 11,
		Random: 12,
		SeedRandom: 13,
		VisitIndex: 14,
		SequenceShuffleIndex: 15,
		StartThread: 16,
		Done: 17,
		End: 18,
		ListFromInt: 19,
		ListRange: 20,
		ReadCount: 21
	};
	CommandType.TOTAL_VALUES = Object.keys(CommandType).length - 1;//-1 because NotSet shoudn't count
	ControlCommand.CommandType = CommandType;

	let PushPopType = {
		Tunnel: 0,
		Function: 1,
	  FunctionEvaluationFromGame: 2
	};

	class Pointer{
		constructor(container, index){
			this.container = container;
			this.index = index;
		}

		Resolve(){
			if (this.index < 0) return this.container;
			if (this.container == null) return null;
			if (this.container.content.length == 0) return this.container;
			if (this.index >= this.container.content.length) return null;

			return this.container.content[this.index];
		}

		get isNull(){
			return this.container == null;
		}

		get path(){
			if (this.isNull) return null;

			if (this.index >= 0)
				return this.container.path.PathByAppendingComponent(new Path$1.Component(this.index));
			else
				return this.container.path;
		}

		toString(){
			if (!this.container)
				return "Ink Pointer (null)";

			return "Ink Pointer -> " + this.container.path.toString() + " -- index " + this.index;
		}

		// This method does not exist in the original C# code, but is here to maintain the
		// value semantics of Pointer.
		copy(){
			return new Pointer(this.container, this.index);
		}

		static StartOf(container){
			return new Pointer(container, 0);
		}

		static get Null() {
			return new Pointer(null, -1);
		}
	}

	class Divert extends Object$1{
		constructor(stackPushType){
			super();
			this._targetPath;
			this._targetPointer;

			this.variableDivertName;
			this.pushesToStack;
			this.stackPushType;

			this.isExternal;
			this.isConditional;
			this.externalArgs;

			//actual constructor
			this.pushesToStack = false;
			if (stackPushType){
				this.pushesToStack = true;
				this.stackPushType = stackPushType;
			}
		}
		get targetPath(){
			// Resolve any relative paths to global ones as we come across them
			if (this._targetPath != null && this._targetPath.isRelative) {
				var targetObj = this.targetPointer.Resolve();
				if (targetObj) {
					this._targetPath = targetObj.path;
				}
			}

			return this._targetPath;
		}
		set targetPath(value){
			this._targetPath = value;
			this._targetPointer = Pointer.Null;
		}
		get targetPointer(){
			if (this._targetPointer.isNull) {
				var targetObj = this.ResolvePath(this._targetPath).obj;

				if (this._targetPath.lastComponent.isIndex) {
					this._targetPointer.container = (targetObj.parent instanceof Container) ? targetObj.parent : null;
					this._targetPointer.index = this._targetPath.lastComponent.index;
				} else {
					this._targetPointer = Pointer.StartOf((targetObj instanceof Container) ? targetObj : null);
				}
			}

			return this._targetPointer.copy();
		}
		get targetPathString(){
			if (this.targetPath == null)
				return null;

			return this.CompactPathString(this.targetPath);
		}
		set targetPathString(value){
			if (value == null) {
				this.targetPath = null;
			} else {
				this.targetPath = new Path$1(value);
			}
		}
		get hasVariableTarget(){
			return this.variableDivertName != null;
		}

		Equals(obj){
	//		var otherDivert = obj as Divert;
			var otherDivert = obj;
			if (otherDivert instanceof Divert) {
				if (this.hasVariableTarget == otherDivert.hasVariableTarget) {
					if (this.hasVariableTarget) {
						return this.variableDivertName == otherDivert.variableDivertName;
					} else {
						return this.targetPath.Equals(otherDivert.targetPath);
					}
				}
			}
			return false;
		}
		toString(){
			if (this.hasVariableTarget) {
				return "Divert(variable: " + this.variableDivertName + ")";
			}
			else if (this.targetPath == null) {
				return "Divert(null)";
			} else {

				var sb = new StringBuilder;

				var targetStr = this.targetPath.toString();

				sb.Append("Divert");

				if (this.isConditional) {
					sb.Append("?");
				}

				if (this.pushesToStack) {
					if (this.stackPushType == PushPopType.Function) {
						sb.Append(" function");
					} else {
						sb.Append(" tunnel");
					}
				}

				sb.Append(" -> ");
				sb.Append(this.targetPathString);

				sb.Append(" (");
				sb.Append(targetStr);
				sb.Append(")");

				return sb.toString();
			}
		}
	}

	class ChoicePoint extends Object$1{
		constructor(onceOnly){
			super();
			this._pathOnChoice;
			this.hasCondition;
			this.hasStartContent;
			this.hasChoiceOnlyContent;
			this.onceOnly;
			this.isInvisibleDefault;
			
			this.onceOnly = !!onceOnly;
		}
		get pathOnChoice(){
			if (this._pathOnChoice != null && this._pathOnChoice.isRelative) {
				var choiceTargetObj = this.choiceTarget;
				if (choiceTargetObj) {
					this._pathOnChoice = choiceTargetObj.path;
				}
			}
			return this._pathOnChoice;
		}
		get choiceTarget(){
			return this.ResolvePath(this._pathOnChoice).container;
		}
		get pathStringOnChoice(){
			return this.CompactPathString(this.pathOnChoice);
		}
		set pathStringOnChoice(value){
			this.pathOnChoice = new Path$1(value);
		}
		get flags(){
			var flags = 0;
			if (this.hasCondition)         flags |= 1;
			if (this.hasStartContent)      flags |= 2;
			if (this.hasChoiceOnlyContent) flags |= 4;
			if (this.isInvisibleDefault)   flags |= 8;
			if (this.onceOnly)             flags |= 16;
			return flags;
		}
		set flags(value){
			this.hasCondition = (value & 1) > 0;
			this.hasStartContent = (value & 2) > 0;
			this.hasChoiceOnlyContent = (value & 4) > 0;
			this.isInvisibleDefault = (value & 8) > 0;
			this.onceOnly = (value & 16) > 0;
		}
		set pathOnChoice(value){
			this._pathOnChoice = value;
		}
		
		toString(){
			var targetString = this.pathOnChoice.toString();

			return "Choice: -> " + targetString;
		}
	}

	class VariableReference extends Object$1{
		constructor(name){
			super();
			this.name = name;
			this.pathForCount;
		}
		get containerForCount(){
			return this.ResolvePath(this.pathForCount).container;
		}
		get pathStringForCount(){
			if( this.pathForCount == null )
				return null;

			return this.CompactPathString(this.pathForCount);
		}
		set pathStringForCount(value){
			if (value == null)
				this.pathForCount = null;
			else
				this.pathForCount = new Path$1(value);
		}
		
		toString(){
			if (this.name != null) {
				return "var(" + this.name + ")";
			} else {
				var pathStr = this.pathStringForCount;
				return "read_count(" + pathStr + ")";
			}
		}
	}

	class VariableAssignment extends Object$1{
		constructor(variableName, isNewDeclaration){
			super();
			this._variableName = variableName || null;
			this._isNewDeclaration = !!isNewDeclaration;
			this.isGlobal;
		}
		get variableName(){
			return this._variableName;
		}
		get isNewDeclaration(){
			return this._isNewDeclaration;
		}
		
		toString(){
			return "VarAssign to " + this.variableName;	}
	}

	class Void extends Object$1{}

	//misses delegates, probably the returns from function calls

	class NativeFunctionCall extends Object$1{
		constructor(name){
			super();
			this.name = name;
			this._numberOfParameters;
			
			this._prototype;
			this._isPrototype;
			this._operationFuncs = null;	
			
			NativeFunctionCall.GenerateNativeFunctionsIfNecessary();
		}
		get name(){
			return this._name;
		}
		set name(value){
			this._name = value;
			if( !this._isPrototype )
				this._prototype = NativeFunctionCall._nativeFunctions[this._name];
		}
		get numberOfParameters(){
			if (this._prototype) {
				return this._prototype.numberOfParameters;
			} else {
				return this._numberOfParameters;
			}
		}
		set numberOfParameters(value){
			this._numberOfParameters = value;
		}
		
		static internalConstructor(name, numberOfParamters){
			var nativeFunc = new NativeFunctionCall(name);
			nativeFunc._isPrototype = true;
			nativeFunc.numberOfParameters = numberOfParamters;
			return nativeFunc;
		}
		static CallWithName(functionName){
			return new NativeFunctionCall(functionName);
		}
		static CallExistsWithName(functionName){
			this.GenerateNativeFunctionsIfNecessary();
			return this._nativeFunctions[functionName];
		}
		Call(parameters){
			if (this._prototype) {
				return this._prototype.Call(parameters);
			}

			if (this.numberOfParameters != parameters.length) {
				throw "Unexpected number of parameters";
			}
			
			var hasList  = false;
			parameters.forEach(p => {
				if (p instanceof Void) throw new StoryException("Attempting to perform operation on a void value. Did you forget to 'return' a value from a function you called here?");
				if (p instanceof ListValue)
					hasList = true;
			});
			
			if (parameters.length == 2 && hasList){
				return this.CallBinaryListOperation(parameters);
			}

			var coercedParams = this.CoerceValuesToSingleType(parameters);
			var coercedType = coercedParams[0].valueType;

			//Originally CallType gets a type parameter that is used to do some casting, but we can do without.
			if (coercedType == ValueType.Int) {
				return this.CallType(coercedParams);
			} else if (coercedType == ValueType.Float) {
				return this.CallType(coercedParams);
			} else if (coercedType == ValueType.String) {
				return this.CallType(coercedParams);
			} else if (coercedType == ValueType.DivertTarget) {
				return this.CallType(coercedParams);
			} else if (coercedType == ValueType.List) {
				return this.CallType(coercedParams);
			}

			return null;
		}
		CallType(parametersOfSingleType){
			var param1 = parametersOfSingleType[0];
			var valType = param1.valueType;

			var val1 = param1;

			var paramCount = parametersOfSingleType.length;

			if (paramCount == 2 || paramCount == 1) {

				var opForTypeObj = this._operationFuncs[valType];
				if (!opForTypeObj) {
					throw new StoryException("Cannot perform operation '"+this.name+"' on "+valType);
				}

				// Binary
				if (paramCount == 2) {
					var param2 = parametersOfSingleType[1];

					var val2 = param2;

					var opForType = opForTypeObj;

					// Return value unknown until it's evaluated
					var resultVal = opForType(val1.value, val2.value);

					return Value.Create(resultVal);
				} 

				// Unary
				else {

					var opForType = opForTypeObj;

					var resultVal = opForType(val1.value);

					return Value.Create(resultVal);
				}  
			}

			else {
				throw "Unexpected number of parameters to NativeFunctionCall: " + parametersOfSingleType.length;
			}
		}
		CallBinaryListOperation(parameters)
		{
			// List-Int addition/subtraction returns a List (e.g. "alpha" + 1 = "beta")
			if ((this.name == "+" || this.name == "-") && parameters[0] instanceof ListValue && parameters[1] instanceof IntValue)
				return this.CallListIncrementOperation(parameters);

	//		var v1 = parameters [0] as Value;
			var v1 = parameters[0];
	//		var v2 = parameters [1] as Value;
			var v2 = parameters[1];

			// And/or with any other type requires coerscion to bool (int)
			if ((this.name == "&&" || this.name == "||") && (v1.valueType != ValueType.List || v2.valueType != ValueType.List)) {
	//			var op = _operationFuncs [ValueType.Int] as BinaryOp<int>;
				var op = this._operationFuncs[ValueType.Int];
				var result = op(v1.isTruthy ? 1 : 0, v2.isTruthy ? 1 : 0);
				return new IntValue(result);
			}

			// Normal (list • list) operation
			if (v1.valueType == ValueType.List && v2.valueType == ValueType.List)
				return this.CallType([v1, v2]);

			throw new StoryException("Can not call use '" + this.name + "' operation on " + v1.valueType + " and " + v2.valueType);
		}
		CallListIncrementOperation(listIntParams)
		{
			var listVal = listIntParams[0];
			var intVal = listIntParams[1];


			var resultInkList = new InkList();

			listVal.value.forEach(listItemWithValue => {
				var listItem = listItemWithValue.Key;
				var listItemValue = listItemWithValue.Value;

				// Find + or - operation
				var intOp = this._operationFuncs[ValueType.Int];

				// Return value unknown until it's evaluated
				var targetInt = intOp(listItemValue, intVal.value);

				// Find this item's origin (linear search should be ok, should be short haha)
				var itemOrigin = null;
				listVal.value.origins.forEach(function(origin){
					if (origin.name == listItem.originName) {
						itemOrigin = origin;
						return false;
					}
				});
				if (itemOrigin != null) {
					var incrementedItem = itemOrigin.TryGetItemWithValue(targetInt);
					if (incrementedItem.exists)
						resultInkList.Add(incrementedItem.item, targetInt);
				}
			});

			return new ListValue(resultInkList);
		}
		CoerceValuesToSingleType(parametersIn){
			var valType = ValueType.Int;
			
			var specialCaseList = null;

			// Find out what the output type is
			// "higher level" types infect both so that binary operations
			// use the same type on both sides. e.g. binary operation of
			// int and float causes the int to be casted to a float.
			parametersIn.forEach(obj => {
				var val = obj;
				if (val.valueType > valType) {
					valType = val.valueType;
				}
				
				if (val.valueType == ValueType.List) {
	//				 specialCaseList = val as ListValue;
					 specialCaseList = val;
				}
			});

			// Coerce to this chosen type
			var parametersOut = [];
			
			if (valType == ValueType.List) {
				parametersIn.forEach(function(val){
					if (val.valueType == ValueType.List) {
						parametersOut.push(val);
					} else if (val.valueType == ValueType.Int) {
						var intVal = parseInt(val.valueObject);
						var list = specialCaseList.value.originOfMaxItem;

						var item = list.TryGetItemWithValue(intVal);
						if (item.exists) {
							var castedValue = new ListValue(item.item, intVal);
							parametersOut.push(castedValue);
						} else
							throw new StoryException("Could not find List item with the value " + intVal + " in " + list.name);
					} else
						throw new StoryException("Cannot mix Lists and " + val.valueType + " values in this operation");
				});
			} 

			// Normal Coercing (with standard casting)
			else {
				parametersIn.forEach(function(val){
					var castedValue = val.Cast(valType);
					parametersOut.push(castedValue);
				});
			}

			return parametersOut;
		}
		static GenerateNativeFunctionsIfNecessary(){
			if (this._nativeFunctions == null) {
				this._nativeFunctions = {};

				// Int operations
				this.AddIntBinaryOp(this.Add,      (x, y) => {return x + y});
				this.AddIntBinaryOp(this.Subtract, (x, y) => {return x - y});
				this.AddIntBinaryOp(this.Multiply, (x, y) => {return x * y});
				this.AddIntBinaryOp(this.Divide,   (x, y) => {return parseInt(x / y)});
				this.AddIntBinaryOp(this.Mod,      (x, y) => {return x % y}); 
				this.AddIntUnaryOp(this.Negate,   x => {return -x}); 

				this.AddIntBinaryOp(this.Equal,    (x, y) => {return x == y ? 1 : 0});
				this.AddIntBinaryOp(this.Greater,  (x, y) => {return x > y  ? 1 : 0});
				this.AddIntBinaryOp(this.Less,     (x, y) => {return x < y  ? 1 : 0});
				this.AddIntBinaryOp(this.GreaterThanOrEquals, (x, y) => {return x >= y ? 1 : 0});
				this.AddIntBinaryOp(this.LessThanOrEquals, (x, y) => {return x <= y ? 1 : 0});
				this.AddIntBinaryOp(this.NotEquals, (x, y) => {return x != y ? 1 : 0});
				this.AddIntUnaryOp(this.Not,       x => {return (x == 0) ? 1 : 0}); 

				this.AddIntBinaryOp(this.And,      (x, y) => {return x != 0 && y != 0 ? 1 : 0});
				this.AddIntBinaryOp(this.Or,       (x, y) => {return x != 0 || y != 0 ? 1 : 0});

				this.AddIntBinaryOp(this.Max,      (x, y) => {return Math.max(x, y)});
				this.AddIntBinaryOp(this.Min,      (x, y) => {return Math.min(x, y)});

				// Float operations
				this.AddFloatBinaryOp(this.Add,      (x, y) => {return x + y});
				this.AddFloatBinaryOp(this.Subtract, (x, y) => {return x - y});
				this.AddFloatBinaryOp(this.Multiply, (x, y) => {return x * y});
				this.AddFloatBinaryOp(this.Divide,   (x, y) => {return x / y});
				this.AddFloatBinaryOp(this.Mod,      (x, y) => {return x % y}); // TODO: Is this the operation we want for floats?
				this.AddFloatUnaryOp(this.Negate,   x => {return -x}); 

				this.AddFloatBinaryOp(this.Equal,    (x, y) => {return x == y ? 1 : 0});
				this.AddFloatBinaryOp(this.Greater,  (x, y) => {return x > y  ? 1 : 0});
				this.AddFloatBinaryOp(this.Less,     (x, y) => {return x < y  ? 1 : 0});
				this.AddFloatBinaryOp(this.GreaterThanOrEquals, (x, y) => {return x >= y ? 1 : 0});
				this.AddFloatBinaryOp(this.LessThanOrEquals, (x, y) => {return x <= y ? 1 : 0});
				this.AddFloatBinaryOp(this.NotEquals, (x, y) => {return x != y ? 1 : 0});
				this.AddFloatUnaryOp(this.Not,       x => {return (x == 0.0) ? 1 : 0}); 

				this.AddFloatBinaryOp(this.And,      (x, y) => {return x != 0.0 && y != 0.0 ? 1 : 0});
				this.AddFloatBinaryOp(this.Or,       (x, y) => {return x != 0.0 || y != 0.0 ? 1 : 0});

				this.AddFloatBinaryOp(this.Max,      (x, y) => {return Math.max(x, y)});
				this.AddFloatBinaryOp(this.Min,      (x, y) => {return Math.min(x, y)});

				// String operations
				this.AddStringBinaryOp(this.Add,     	(x, y) => {return x + y}); // concat
				this.AddStringBinaryOp(this.Equal,   	(x, y) => {return x === y ? 1 : 0});
				this.AddStringBinaryOp(this.NotEquals,(x, y) => {return !(x === y) ? 1 : 0});
				this.AddStringBinaryOp(this.Has,      (x, y) => {return x.includes(y) ? 1 : 0});
				this.AddStringBinaryOp(this.Hasnt,      (x, y) => {return x.includes(y) ? 0 : 1});
				
				this.AddListBinaryOp(this.Add, 		 (x, y) => {return x.Union(y)});
				this.AddListBinaryOp(this.Subtract,  (x, y) => {return x.Without(y)});
				this.AddListBinaryOp(this.Has, 		 (x, y) => {return x.Contains(y) ? 1 : 0});
				this.AddListBinaryOp(this.Hasnt, 	 (x, y) => {return x.Contains(y) ? 0 : 1});
				this.AddListBinaryOp(this.Intersect, (x, y) => {return x.Intersect(y)});
				
				this.AddListBinaryOp(this.Equal, 				(x, y) => {return x.Equals(y) ? 1 : 0});
				this.AddListBinaryOp(this.Greater, 				(x, y) => {return x.GreaterThan(y) ? 1 : 0});
				this.AddListBinaryOp(this.Less, 				(x, y) => {return x.LessThan(y) ? 1 : 0});
				this.AddListBinaryOp(this.GreaterThanOrEquals, 	(x, y) => {return x.GreaterThanOrEquals(y) ? 1 : 0});
				this.AddListBinaryOp(this.LessThanOrEquals, 	(x, y) => {return x.LessThanOrEquals(y) ? 1 : 0});
				this.AddListBinaryOp(this.NotEquals, 			(x, y) => {return !x.Equals(y) ? 1 : 0});

				this.AddListBinaryOp (this.And, 				(x, y) => {return x.Count > 0 && y.Count > 0 ? 1 : 0});
	      this.AddListBinaryOp (this.Or,  				(x, y) => {return x.Count > 0 || y.Count > 0 ? 1 : 0});
				
				this.AddListUnaryOp(this.Not, (x) => {return x.Count == 0 ? 1 : 0});

				this.AddListUnaryOp(this.Invert, (x) => {return x.inverse});
				this.AddListUnaryOp(this.All, (x) => {return x.all});
				this.AddListUnaryOp(this.ListMin, (x) => {return x.MinAsList()});
				this.AddListUnaryOp(this.ListMax, (x) => {return x.MaxAsList()});
				this.AddListUnaryOp(this.Count,  (x) => {return x.Count});
				this.AddListUnaryOp(this.ValueOfList,  (x) => {return x.maxItem.Value});

				// Special case: The only operation you can do on divert target values
				var divertTargetsEqual = (d1, d2) => {
					return d1.Equals(d2) ? 1 : 0;
				};
				this.AddOpToNativeFunc(this.Equal, 2, ValueType.DivertTarget, divertTargetsEqual);
			}
		}
		AddOpFuncForType(valType, op){
			if (this._operationFuncs == null) {
				this._operationFuncs = {};
			}

			this._operationFuncs[valType] = op;
		}
		static AddOpToNativeFunc(name, args, valType, op){
			var nativeFunc = this._nativeFunctions[name];
			if (!nativeFunc) {
				nativeFunc = NativeFunctionCall.internalConstructor(name, args);
				this._nativeFunctions[name] = nativeFunc;
			}

			nativeFunc.AddOpFuncForType(valType, op);
		}
		
		static AddIntBinaryOp(name, op){
			this.AddOpToNativeFunc(name, 2, ValueType.Int, op);
		}
		static AddIntUnaryOp(name, op){
			this.AddOpToNativeFunc(name, 1, ValueType.Int, op);
		}
		
		static AddFloatBinaryOp(name, op){
			this.AddOpToNativeFunc(name, 2, ValueType.Float, op);
		}
		static AddFloatUnaryOp(name, op){
			this.AddOpToNativeFunc(name, 1, ValueType.Float, op);
		}
		
		static AddStringBinaryOp(name, op){
			this.AddOpToNativeFunc(name, 2, ValueType.String, op);
		}
		
		static AddListBinaryOp(name, op){
			this.AddOpToNativeFunc(name, 2, ValueType.List, op);
		}
		static AddListUnaryOp(name, op){
			this.AddOpToNativeFunc(name, 1, ValueType.List, op);
		}
		
		toString(){
			return "Native '" + this.name + "'";
		}
	}

	NativeFunctionCall.Add 		= "+";
	NativeFunctionCall.Subtract = "-";
	NativeFunctionCall.Divide   = "/";
	NativeFunctionCall.Multiply = "*";
	NativeFunctionCall.Mod      = "%";
	NativeFunctionCall.Negate   = "_";

	NativeFunctionCall.Equal    = "==";
	NativeFunctionCall.Greater  = ">";
	NativeFunctionCall.Less     = "<";
	NativeFunctionCall.GreaterThanOrEquals = ">=";
	NativeFunctionCall.LessThanOrEquals = "<=";
	NativeFunctionCall.NotEquals   = "!=";
	NativeFunctionCall.Not      = "!";

	NativeFunctionCall.And      = "&&";
	NativeFunctionCall.Or       = "||";

	NativeFunctionCall.Min      = "MIN";
	NativeFunctionCall.Max      = "MAX";

	NativeFunctionCall.Has      = "?";
	NativeFunctionCall.Hasnt    = "!?";
	NativeFunctionCall.Intersect = "^";

	NativeFunctionCall.ListMin   = "LIST_MIN";
	NativeFunctionCall.ListMax   = "LIST_MAX";
	NativeFunctionCall.All       = "LIST_ALL";
	NativeFunctionCall.Count     = "LIST_COUNT";
	NativeFunctionCall.ValueOfList = "LIST_VALUE";
	NativeFunctionCall.Invert    = "LIST_INVERT";

	NativeFunctionCall._nativeFunctions = null;

	class Tag extends Object$1{
		constructor(tagText){
			super();
			this._text = tagText.toString() || '';
		}
		get text(){
			return this._text;
		}
		toString(){
			return "# " + this._text;
		}
	}

	class Choice{
		constructor(){
			this.text;
			this.index;
			this.choicePoint;
			this.threadAtGeneration;
			this.sourcePath;
			this.targetPath;
			this.isInvisibleDefault = false;

			this._originalThreadIndex;
		}
		get pathStringOnChoice(){
			return this.targetPath.toString();
		}
	  set pathStringOnChoice(value){
			this.targetPath = new Path$1(value);
		}
	}

	class ListDefinition{
		constructor(name, items){
			this._name = name || '';
			this._items = null;
			this._rawListItemsKeys = null;
			this._itemNameToValues = items || {};
		}
		get name(){
			return this._name;
		}
		get items(){
			if (this._items == null){
				this._items = {};
				this._rawListItemsKeys = {};
				for (var key in this._itemNameToValues){
					var item = new InkListItem(this.name, key);
					this._rawListItemsKeys[item] = item;
					this._items[item] = this._itemNameToValues[key];
				}
			}
			this._items.forEach = this.forEachItems.bind(this);
			
			return this._items;
		}
		forEachItems(fn){
			for (var key in this._rawListItemsKeys){
				fn({
					Key: this._rawListItemsKeys[key],
					Value: this._items[key]
				});
			}
		}
		ValueForItem(item){
			var intVal = this._itemNameToValues[item.itemName];
			if (intVal !== undefined)
				return intVal;
			else
				return 0;
		}
		ContainsItem(item){
			if (item.originName != this.name) return false;

			return (item.itemName in this._itemNameToValues);
		}
		ContainsItemWithName(itemName){
			return this._itemNameToValues[itemName] !== undefined;
		}
		TryGetItemWithValue(val, item){//item was an out
			//the original function returns a boolean and has a second parameter called item that is an `out`. Both are needed and we can't just return the item because it'll always be truthy. Instead, we return an object containing the bool and the item
			for (var key in this._itemNameToValues){
				if (this._itemNameToValues[key] == val) {
					item = new InkListItem(this.name, key);
					return {
						item :item,
						exists: true
					};
				}
			}

			item = InkListItem.Null;
			return {
				item :item,
				exists: false
			};
		}
		TryGetValueForItem(item, intval){//intval is an out
			intVal = this._itemNameToValues[item.itemName];
			return intVal;
		}
		ListRange(min, max){
			var rawList = new InkList();
			for (var key in this._itemNameToValues){
				if (this._itemNameToValues[key] >= min && this._itemNameToValues[key] <= max) {
					var item = new InkListItem(this.name, key);
					rawList.Add(item, this._itemNameToValues[key]);
				}
			}
			return new ListValue(rawList);
		}
	}

	class ListDefinitionsOrigin{
		constructor(lists){
			this._lists = {};
	    this._allUnambiguousListValueCache = {};
			
			lists.forEach((list)=>{
				this._lists[list.name] = list;
	      
	      list.items.forEach(itemWithValue => {
	        var item = itemWithValue.Key;
	        var val = itemWithValue.Value;
	        var listValue = new ListValue(item, val);
	        
	        this._allUnambiguousListValueCache[item.itemName] = listValue;
	        this._allUnambiguousListValueCache[item.fullName] = listValue;
	      });
			});
		}
		get lists(){
			var listOfLists = [];
			
			for (var key in this._lists){
				listOfLists.push(this._lists[key]);
			}
			return listOfLists;
		}
		TryListGetDefinition(name, def){
			//initially, this function returns a boolean and the second parameter is an out.
			return (name in this._lists) ? this._lists[name] : def;
		}
		FindSingleItemListWithName(name){
			var val = null;
	    if (typeof this._allUnambiguousListValueCache[name] !== 'undefined') val = this._allUnambiguousListValueCache[name];
	    return val;
		}
	}

	class JsonSerialisation{
		static ListToJArray(serialisables){
			var jArray = [];
			serialisables.forEach(s => {
				jArray.push(this.RuntimeObjectToJToken(s));
			});
			return jArray;
		}
		static JArrayToRuntimeObjList(jArray, skipLast){
			var count = jArray.length;
			if (skipLast) count--;

			var list = [];

			for (var i = 0; i < count; i++){
				var jTok = jArray[i];
				var runtimeObj = this.JTokenToRuntimeObject(jTok);
				list.push(runtimeObj);
			}

			return list;
		}
		static JObjectToDictionaryRuntimeObjs(jObject){
			var dict = {};

			for (var key in jObject){
				dict[key] = this.JTokenToRuntimeObject(jObject[key]);
			}

			return dict;
		}
		static DictionaryRuntimeObjsToJObject(dictionary){
			var jsonObj = {};

			for (var key in dictionary){
	//			var runtimeObj = keyVal.Value as Runtime.Object;
				var runtimeObj = dictionary[key];
				if (runtimeObj instanceof Object$1)
					jsonObj[key] = this.RuntimeObjectToJToken(runtimeObj);
			}

			return jsonObj;
		}
		static JObjectToIntDictionary(jObject){
			var dict = {};
			for (var key in jObject){
				dict[key] = parseInt(jObject[key]);
			}
			return dict;
		}
		static IntDictionaryToJObject(dict){
			var jObj = {};
			for (var key in dict){
				jObj[key] = dict[key];
			}
			return jObj;
		}
		static JTokenToRuntimeObject(token){
			if (typeof token === 'number' && !isNaN(token)) {
				return Value.Create(token);
			}

			if (typeof token === 'string'){
				var str = token.toString();

				// String value
				var firstChar = str[0];
				if (firstChar == '^')
					return new StringValue(str.substring(1));
				else if(firstChar == "\n" && str.length == 1)
					return new StringValue("\n");

				// Glue
				if (str == "<>") return new Glue();

				// Control commands (would looking up in a hash set be faster?)
				for (var i = 0; i < _controlCommandNames.length; ++i) {
					var cmdName = _controlCommandNames[i];
					if (str == cmdName) {
						return new ControlCommand(i);
					}
				}

				// Native functions
				if (str == "L^") str = "^";
				if( NativeFunctionCall.CallExistsWithName(str) )
					return NativeFunctionCall.CallWithName(str);

				// Pop
				if (str == "->->")
					return ControlCommand.PopTunnel();
				else if (str == "~ret")
					return ControlCommand.PopFunction();

				// Void
				if (str == "void")
					return new Void ();
			}

			if (typeof token === 'object' && token instanceof Array === false){
				var obj = token;
				var propValue;

				// Divert target value to path
				if (obj["^->"]){
					propValue = obj["^->"];
					return new DivertTargetValue(new Path$1(propValue.toString()));
				}

				// VariablePointerValue
				if (obj["^var"]) {
					propValue = obj["^var"];
					var varPtr = new VariablePointerValue(propValue.toString());
					if ('ci' in obj){
						propValue = obj["ci"];
						varPtr.contextIndex = parseInt(propValue);
					}
					return varPtr;
				}

				// Divert
				var isDivert = false;
				var pushesToStack = false;
				var divPushType = PushPopType.Function;
				var external = false;
				if (propValue = obj["->"]) {
					isDivert = true;
				}
				else if (propValue = obj["f()"]) {
					isDivert = true;
					pushesToStack = true;
					divPushType = PushPopType.Function;
				}
				else if (propValue = obj["->t->"]) {
					isDivert = true;
					pushesToStack = true;
					divPushType = PushPopType.Tunnel;
				}
				else if (propValue = obj["x()"]) {
					isDivert = true;
					external = true;
					pushesToStack = false;
					divPushType = PushPopType.Function;
				}

				if (isDivert) {
					var divert = new Divert();
					divert.pushesToStack = pushesToStack;
					divert.stackPushType = divPushType;
					divert.isExternal = external;

					var target = propValue.toString();

					if (propValue = obj["var"])
						divert.variableDivertName = target;
					else
						divert.targetPathString = target;

					divert.isConditional = !!obj["c"];

					if (external) {
						if (propValue = obj["exArgs"])
							divert.externalArgs = parseInt(propValue);
					}

					return divert;
				}

				// Choice
				if (propValue = obj["*"]) {
					var choice = new ChoicePoint();
					choice.pathStringOnChoice = propValue.toString();

					if (propValue = obj["flg"])
						choice.flags = parseInt(propValue);

					return choice;
				}

				// Variable reference
				if (propValue = obj["VAR?"]) {
					return new VariableReference(propValue.toString());
				} else if (propValue = obj["CNT?"]) {
					var readCountVarRef = new VariableReference();
					readCountVarRef.pathStringForCount = propValue.toString();
					return readCountVarRef;
				}

				// Variable assignment
				var isVarAss = false;
				var isGlobalVar = false;
				if (propValue = obj["VAR="]) {
					isVarAss = true;
					isGlobalVar = true;
				} else if (propValue = obj["temp="]) {
					isVarAss = true;
					isGlobalVar = false;
				}
				if (isVarAss) {
					var varName = propValue.toString();
					var isNewDecl = !obj["re"];
					var varAss = new VariableAssignment(varName, isNewDecl);
					varAss.isGlobal = isGlobalVar;
					return varAss;
				}
				if (obj["#"] !== undefined){
					propValue = obj["#"];
					return new Tag(propValue.toString());
				}
				//list value
				if (propValue = obj["list"]) {
	//				var listContent = (Dictionary<string, object>)propValue;
					var listContent = propValue;
					var rawList = new InkList();
					if (propValue = obj["origins"]) {
	//					var namesAsObjs = (List<object>)propValue;
						var namesAsObjs = propValue;
	//					rawList.SetInitialOriginNames(namesAsObjs.Cast<string>().ToList());
						rawList.SetInitialOriginNames(namesAsObjs);
					}

					for (var key in listContent){
						var nameToVal = listContent[key];
						var item = new InkListItem(key);
						var val = parseInt(nameToVal);
						rawList.Add(item, val);
					}

					return new ListValue(rawList);
				}

				if (obj["originalChoicePath"] != null)
					return this.JObjectToChoice(obj);
			}

			// Array is always a Runtime.Container
			if (token instanceof Array){
				return this.JArrayToContainer(token);
			}

			if (token == null)
	                return null;

			throw "Failed to convert token to runtime object: " + JSON.stringify(token);
		}
		static RuntimeObjectToJToken(obj){
	//		var container = obj as Container;
			var container = obj;
			if (container instanceof Container) {
				return this.ContainerToJArray(container);
			}

	//		var divert = obj as Divert;
			var divert = obj;
			if (divert instanceof Divert) {
				var divTypeKey = "->";
				if (divert.isExternal)
					divTypeKey = "x()";
				else if (divert.pushesToStack) {
					if (divert.stackPushType == PushPopType.Function)
						divTypeKey = "f()";
					else if (divert.stackPushType == PushPopType.Tunnel)
						divTypeKey = "->t->";
				}

				var targetStr;
				if (divert.hasVariableTarget)
					targetStr = divert.variableDivertName;
				else
					targetStr = divert.targetPathString;

				var jObj = {};
				jObj[divTypeKey] = targetStr;

				if (divert.hasVariableTarget)
					jObj["var"] = true;

				if (divert.isConditional)
					jObj["c"] = true;

				if (divert.externalArgs > 0)
					jObj["exArgs"] = divert.externalArgs;

				return jObj;
			}

	//		var choicePoint = obj as ChoicePoint;
			var choicePoint = obj;
			if (choicePoint instanceof ChoicePoint) {
				var jObj = {};
				jObj["*"] = choicePoint.pathStringOnChoice;
				jObj["flg"] = choicePoint.flags;
				return jObj;
			}

	//		var intVal = obj as IntValue;
			var intVal = obj;
			if (intVal instanceof IntValue)
				return intVal.value;

	//		var floatVal = obj as FloatValue;
			var floatVal = obj;
			if (floatVal instanceof FloatValue)
				return floatVal.value;

	//		var strVal = obj as StringValue;
			var strVal = obj;
			if (strVal instanceof StringValue) {
				if (strVal.isNewline)
					return "\n";
				else
					return "^" + strVal.value;
			}

	//		var listVal = obj as ListValue;
			var listVal = obj;
			if (listVal instanceof ListValue) {
				return this.InkListToJObject(listVal);
			}

	//		var divTargetVal = obj as DivertTargetValue;
			var divTargetVal = obj;
			if (divTargetVal instanceof DivertTargetValue)
				return {
					"^->": divTargetVal.value.componentsString
				};

	//		var varPtrVal = obj as VariablePointerValue;
			var varPtrVal = obj;
			if (varPtrVal instanceof VariablePointerValue)
				return {
					"^var": varPtrVal.value,
					"ci": varPtrVal.contextIndex
				};

	//		var glue = obj as Runtime.Glue;
			var glue = obj;
			if (glue instanceof Glue) return "<>";

	//		var controlCmd = obj as ControlCommand;
			var controlCmd = obj;
			if (controlCmd instanceof ControlCommand) {
				return _controlCommandNames[parseInt(controlCmd.commandType)];
			}

	//		var nativeFunc = obj as Runtime.NativeFunctionCall;
			var nativeFunc = obj;
			if (nativeFunc instanceof NativeFunctionCall) {
				var name = nativeFunc.name;

				// Avoid collision with ^ used to indicate a string
				if (name == "^") name = "L^";
				return name;
			}

			// Variable reference
	//		var varRef = obj as VariableReference;
			var varRef = obj;
			if (varRef instanceof VariableReference) {
				var jObj = {};
				var readCountPath = varRef.pathStringForCount;
				if (readCountPath != null) {
					jObj["CNT?"] = readCountPath;
				} else {
					jObj["VAR?"] = varRef.name;
				}

				return jObj;
			}

			// Variable assignment
	//		var varAss = obj as VariableAssignment;
			var varAss = obj;
			if (varAss instanceof VariableAssignment) {
				var key = varAss.isGlobal ? "VAR=" : "temp=";
				var jObj = {};
				jObj[key] = varAss.variableName;

				// Reassignment?
				if (!varAss.isNewDeclaration)
					jObj["re"] = true;

				return jObj;
			}

	//		var voidObj = obj as Void;
			var voidObj = obj;
			if (voidObj instanceof Void)
				return "void";

	//		var tag = obj as Tag;
			var tag = obj;
			if (tag instanceof Tag) {
				var jObj = {};
				jObj["#"] = tag.text;
				return jObj;
			}

			// Used when serialising save state only
	//		var choice = obj as Choice;
			var choice = obj;
			if (choice instanceof Choice)
				return this.ChoiceToJObject(choice);

			throw "Failed to convert runtime object to Json token: " + obj;
		}
		static ContainerToJArray(container){
			var jArray = this.ListToJArray(container.content);

			// Container is always an array [...]
			// But the final element is always either:
			//  - a dictionary containing the named content, as well as possibly
			//    the key "#" with the count flags
			//  - null, if neither of the above
			var namedOnlyContent = container.namedOnlyContent;
			var countFlags = container.countFlags;
			if (namedOnlyContent != null && namedOnlyContent.length > 0 || countFlags > 0 || container.name != null) {

				var terminatingObj;
				if (namedOnlyContent != null) {
					terminatingObj = this.DictionaryRuntimeObjsToJObject(namedOnlyContent);

					// Strip redundant names from containers if necessary
					for (var key in terminatingObj){
	//					var subContainerJArray = namedContentObj.Value as JArray;
						var subContainerJArray = terminatingObj[key];
						if (subContainerJArray != null) {
	//						var attrJObj = subContainerJArray [subContainerJArray.Count - 1] as JObject;
							var attrJObj = subContainerJArray[subContainerJArray.length - 1];
							if (attrJObj != null) {
								delete attrJObj["#n"];
								if (Object.keys(attrJObj).length == 0)
									subContainerJArray[subContainerJArray.length - 1] = null;
							}
						}
					}

				} else
					terminatingObj = {};

				if( countFlags > 0 )
					terminatingObj["#f"] = countFlags;

				if( container.name != null )
					terminatingObj["#n"] = container.name;

				jArray.push(terminatingObj);
			}

			// Add null terminator to indicate that there's no dictionary
			else {
				jArray.push(null);
			}

			return jArray;
		}
		static JArrayToContainer(jArray){
			var container = new Container();
			container.content = this.JArrayToRuntimeObjList(jArray, true);

			// Final object in the array is always a combination of
			//  - named content
			//  - a "#" key with the countFlags
			// (if either exists at all, otherwise null)
	//		var terminatingObj = jArray [jArray.Count - 1] as JObject;
			var terminatingObj = jArray[jArray.length - 1];
			if (terminatingObj != null) {

				var namedOnlyContent = {};

				for (var key in terminatingObj){
					if (key == "#f") {
						container.countFlags = parseInt(terminatingObj[key]);
					} else if (key == "#n") {
						container.name = terminatingObj[key].toString();
					} else {
						var namedContentItem = this.JTokenToRuntimeObject(terminatingObj[key]);
	//					var namedSubContainer = namedContentItem as Container;
						var namedSubContainer = namedContentItem;
						if (namedSubContainer instanceof Container)
							namedSubContainer.name = key;
						namedOnlyContent[key] = namedContentItem;
					}
				}

				container.namedOnlyContent = namedOnlyContent;
			}

			return container;
		}
		static JObjectToChoice(jObj){
			var choice = new Choice();
			choice.text = jObj["text"].toString();
			choice.index = parseInt(jObj["index"]);
			choice.sourcePath = jObj["originalChoicePath"].toString();
			choice.originalThreadIndex = parseInt(jObj["originalThreadIndex"]);
			choice.pathStringOnChoice = jObj["targetPath"].toString();
			return choice;
		}
		static ChoiceToJObject(choice){
			var jObj = {};
			jObj["text"] = choice.text;
			jObj["index"] = choice.index;
			jObj["originalChoicePath"] = choice.sourcePath;
			jObj["originalThreadIndex"] = choice.originalThreadIndex;
			jObj["targetPath"] = choice.pathStringOnChoice;
			return jObj;
		}
		static InkListToJObject (listVal){
			var rawList = listVal.value;

			var dict = {};

			var content = {};

			rawList.forEach(function(itemAndValue){
				var item = itemAndValue.Key;
				var val = itemAndValue.Value;
				content[item.toString()] = val;
			});

			dict["list"] = content;

			if (rawList.Count == 0 && rawList.originNames != null && rawList.originNames.length > 0) {
	//			dict["origins"] = rawList.originNames.Cast<object> ().ToList ();
				dict["origins"] = rawList.originNames;
			}

			return dict;
		}
		static ListDefinitionsToJToken(origin){
			var result = {};

			origin.lists.forEach(function(def){
				var listDefJson = {};
				def.items.forEach(function(itemToVal){
					var item = itemToVal.Key;
					var val = itemToVal.Value;
					listDefJson[item.itemName] = val;
				});

				result[def.name] = listDefJson;
			});

			return result;
		}
		static JTokenToListDefinitions(obj){
	//		var defsObj = (Dictionary<string, object>)obj;
			var defsObj = obj;

			var allDefs = [];

			for (var key in defsObj){
				var name = key.toString();
	//			var listDefJson = (Dictionary<string, object>)kv.Value;
				var listDefJson = defsObj[key];

				// Cast (string, object) to (string, int) for items
				var items = {};

				for (var nameValueKey in listDefJson){
					var nameValue = listDefJson[nameValueKey];
					items[nameValueKey] = parseInt(nameValue);
				}

				var def = new ListDefinition(name, items);
				allDefs.push(def);
			}

			return new ListDefinitionsOrigin(allDefs);
		}
	}

	var _controlCommandNames = [];

	_controlCommandNames[ControlCommand.CommandType.EvalStart] = "ev";
	_controlCommandNames[ControlCommand.CommandType.EvalOutput] = "out";
	_controlCommandNames[ControlCommand.CommandType.EvalEnd] = "/ev";
	_controlCommandNames[ControlCommand.CommandType.Duplicate] = "du";
	_controlCommandNames[ControlCommand.CommandType.PopEvaluatedValue] = "pop";
	_controlCommandNames[ControlCommand.CommandType.PopFunction] = "~ret";
	_controlCommandNames[ControlCommand.CommandType.PopTunnel] = "->->";
	_controlCommandNames[ControlCommand.CommandType.BeginString] = "str";
	_controlCommandNames[ControlCommand.CommandType.EndString] = "/str";
	_controlCommandNames[ControlCommand.CommandType.NoOp] = "nop";
	_controlCommandNames[ControlCommand.CommandType.ChoiceCount] = "choiceCnt";
	_controlCommandNames[ControlCommand.CommandType.TurnsSince] = "turns";
	_controlCommandNames[ControlCommand.CommandType.ReadCount] = "readc";
	_controlCommandNames[ControlCommand.CommandType.Random] = "rnd";
	_controlCommandNames[ControlCommand.CommandType.SeedRandom] = "srnd";
	_controlCommandNames[ControlCommand.CommandType.VisitIndex] = "visit";
	_controlCommandNames[ControlCommand.CommandType.SequenceShuffleIndex] = "seq";
	_controlCommandNames[ControlCommand.CommandType.StartThread] = "thread";
	_controlCommandNames[ControlCommand.CommandType.Done] = "done";
	_controlCommandNames[ControlCommand.CommandType.End] = "end";
	_controlCommandNames[ControlCommand.CommandType.ListFromInt] = "listInt";
	_controlCommandNames[ControlCommand.CommandType.ListRange] = "range";

	for (var i$1 = 0; i$1 < ControlCommand.CommandType.TOTAL_VALUES; ++i$1) {
		if (_controlCommandNames[i$1] == null)
			throw "Control command not accounted for in serialisation";
	}

	class Element{
		constructor(type, pointer, inExpressionEvaluation){
			this.currentPointer = pointer.copy();

			this.inExpressionEvaluation = inExpressionEvaluation || false;
			this.temporaryVariables = {};
			this.type = type;

			this.evaluationStackHeightWhenPushed = 0;
			this.functionStartInOutputStream = 0;
		}

		Copy(){
			var copy = new Element(this.type, this.currentPointer, this.inExpressionEvaluation);
			Object.assign(copy.temporaryVariables, this.temporaryVariables);
			copy.evaluationStackHeightWhenPushed = this.evaluationStackHeightWhenPushed;
			copy.functionStartInOutputStream = this.functionStartInOutputStream;
			return copy;
		}
	}

	class Thread{
		constructor(jsonToken, storyContext){
			this.callstack = [];
			this.threadIndex = 0;
			this.previousPointer = Pointer.Null;

			if (jsonToken && storyContext){
				var jThreadObj = jsonToken;
				this.threadIndex = parseInt(jThreadObj["threadIndex"]);

				var jThreadCallstack = jThreadObj["callstack"];

				jThreadCallstack.forEach(jElTok => {
					var jElementObj = jElTok;

					var pushPopType = parseInt(jElementObj["type"]);

					var pointer = Pointer.Null;

					var currentContainerPathStr = null;
					var currentContainerPathStrToken = jElementObj["cPath"];
					if (typeof currentContainerPathStrToken !== 'undefined') {
						currentContainerPathStr = currentContainerPathStrToken.toString();

						var threadPointerResult = storyContext.ContentAtPath(new Path$1(currentContainerPathStr));
						pointer.container = threadPointerResult.container;
						pointer.index = parseInt(jElementObj["idx"]);

						if (threadPointerResult.obj == null)
							throw "When loading state, internal story location couldn't be found: " + currentContainerPathStr + ". Has the story changed since this save data was created?";
						else if (threadPointerResult.approximate)
							storyContext.Warning("When loading state, exact internal story location couldn't be found: '" + currentContainerPathStr + "', so it was approximated to '"+pointer.container.path.toString()+"' to recover. Has the story changed since this save data was created?");
					}

					var inExpressionEvaluation = !!jElementObj["exp"];

					var el = new Element(pushPopType, pointer, inExpressionEvaluation);

					var jObjTemps = jElementObj["temp"];
					el.temporaryVariables = JsonSerialisation.JObjectToDictionaryRuntimeObjs(jObjTemps);

					this.callstack.push(el);
				});

				var prevContentObjPath = jThreadObj["previousContentObject"];
				if(typeof prevContentObjPath !== 'undefined') {
					var prevPath = new Path$1(prevContentObjPath.toString());
					this.previousPointer = storyContext.PointerAtPath(prevPath);
				}
			}
		}

		get jsonToken(){
			var threadJObj = {};

			var jThreadCallstack = [];
			this.callstack.forEach(el => {
				var jObj = {};
				if (!el.currentPointer.isNull) {
					jObj["cPath"] = el.currentPointer.container.path.componentsString;
					jObj["idx"] = el.currentPointer.index;
				}
				jObj["exp"] = el.inExpressionEvaluation;
				jObj["type"] = parseInt(el.type);
				jObj["temp"] = JsonSerialisation.DictionaryRuntimeObjsToJObject(el.temporaryVariables);
				jThreadCallstack.push(jObj);
			});

			threadJObj["callstack"] = jThreadCallstack;
			threadJObj["threadIndex"] = this.threadIndex;

			if (!this.previousPointer.isNull)
				threadJObj["previousContentObject"] = this.previousPointer.Resolve().path.toString();

			return threadJObj;
		}

		Copy(){
			var copy = new Thread();
			copy.threadIndex = this.threadIndex;
			this.callstack.forEach(e => {
				copy.callstack.push(e.Copy());
			});
			copy.previousPointer = this.previousPointer.copy();
			return copy;
		}
	}

	class CallStack{
		constructor(copyOrrootContentContainer){
			this._threads = [];
			this._threadCounter = 0;
			this._threads.push(new Thread());

			if (copyOrrootContentContainer instanceof CallStack){
				this._threads = [];

				copyOrrootContentContainer._threads.forEach(otherThread => {
					this._threads.push(otherThread.Copy());
				});
			}
			else{
				this._threads[0].callstack.push(new Element(PushPopType.Tunnel, Pointer.StartOf(copyOrrootContentContainer)));
			}
		}
		get currentThread(){
			return this._threads[this._threads.length - 1];
		}
		set currentThread(value){
			if (this._threads.length != 1) console.warn("Shouldn't be directly setting the current thread when we have a stack of them");

			this._threads.length = 0;
			this._threads.push(value);
		}
		get callStack(){
			return this.currentThread.callstack;
		}
		get callStackTrace(){
			var sb = new StringBuilder();

			for (var t = 0; t < this._threads.length; t++) {
				var thread = this._threads[t];
				var isCurrent = (t == this._threads.length - 1);
				sb.AppendFormat("=== THREAD {0}/{1} {2}===\n", (t+1), this._threads.length, (isCurrent ? "(current) ":""));

				for (var i = 0; i < thread.callstack.length; i++) {

					if (thread.callstack[i].type == PushPopType.Function)
						sb.Append("  [FUNCTION] ");
					else
						sb.Append("  [TUNNEL] ");

					var pointer = thread.callstack[i].currentPointer;
					if(!pointer.isNull) {
						sb.Append("<SOMEWHERE IN ");
						sb.Append(pointer.container.path.toString());
						sb.AppendLine(">");
					}
				}
			}

			return sb.toString();
		}
		get elements(){
			return this.callStack;
		}
		get depth(){
			return this.elements.length;
		}
		get currentElement(){
			var thread = this._threads[this._threads.length - 1];
			var cs = thread.callstack;
			return cs[cs.length - 1];
		}
		get currentElementIndex(){
			return this.callStack.length - 1;
		}
		get canPop(){
			return this.callStack.length > 1;
		}
		get canPopThread(){
			return this._threads.length > 1 && !this.elementIsEvaluateFromGame;
		}
		get elementIsEvaluateFromGame(){
			return this.currentElement.type == PushPopType.FunctionEvaluationFromGame;
		}

		CanPop(type){
			if (!this.canPop)
				return false;

			if (type == null)
				return true;

			return this.currentElement.type == type;
		}
		Pop(type){
			if (this.CanPop(type)) {
				this.callStack.pop();
				return;
			} else {
				throw "Mismatched push/pop in Callstack";
			}
		}
		Push(type, externalEvaluationStackHeight, outputStreamLengthWithPushed){
			externalEvaluationStackHeight = (typeof externalEvaluationStackHeight !== 'undefined') ? externalEvaluationStackHeight : 0;
			outputStreamLengthWithPushed = (typeof outputStreamLengthWithPushed !== 'undefined') ? outputStreamLengthWithPushed : 0;

			var element = new Element (
				type,
				this.currentElement.currentPointer,
				false
			);

			element.evaluationStackHeightWhenPushed = externalEvaluationStackHeight;
			element.functionStartInOutputStream = outputStreamLengthWithPushed;

			this.callStack.push (element);
		}
		PushThread(){
			var newThread = this.currentThread.Copy();
			this._threadCounter++;
			newThread.threadIndex = this._threadCounter;
			this._threads.push(newThread);
		}
		PopThread(){
			if (this.canPopThread) {
				this._threads.splice(this._threads.indexOf(this.currentThread), 1);//should be equivalent to a pop()
			} else {
				throw "Can't pop thread";
			}
		}
		SetJsonToken(token, storyContext){
			this._threads.length = 0;

			var jObject = token;

			var jThreads = jObject["threads"];

			jThreads.forEach(jThreadTok => {
				var thread = new Thread(jThreadTok, storyContext);
				this._threads.push(thread);
			});

			this._threadCounter = parseInt(jObject["threadCounter"]);
		}
		GetJsonToken(){
			var jObject = {};

			var jThreads = [];
			this._threads.forEach(thread => {
				jThreads.push(thread.jsonToken);
			});

			jObject["threads"] = jThreads;
			jObject["threadCounter"] = this._threadCounter;

			return jObject;
		}
		GetTemporaryVariableWithName(name, contextIndex){
			contextIndex = (typeof contextIndex === 'undefined') ? -1 : contextIndex;

			if (contextIndex == -1)
				contextIndex = this.currentElementIndex + 1;

			var varValue = null;

			var contextElement = this.callStack[contextIndex - 1];

			if (varValue = contextElement.temporaryVariables[name]) {
				return varValue;
			} else {
				return null;
			}
		}
		SetTemporaryVariable(name, value, declareNew, contextIndex){
			contextIndex = (typeof contextIndex === 'undefined') ? -1 : contextIndex;

			if (contextIndex == -1)
				contextIndex = this.currentElementIndex + 1;

			var contextElement = this.callStack[contextIndex - 1];

			if (!declareNew && !contextElement.temporaryVariables[name]) {
				throw new StoryException("Could not find temporary variable to set: " + name);
			}

			var oldValue;
			if( oldValue = contextElement.temporaryVariables[name] )
				ListValue.RetainListOriginsForAssignment(oldValue, value);

			contextElement.temporaryVariables[name] = value;
		}
		ContextForVariableNamed(name){
			// Current temporary context?
			// (Shouldn't attempt to access contexts higher in the callstack.)
			if (this.currentElement.temporaryVariables[name]) {
				return this.currentElementIndex + 1;
			}

			// Global
			else {
				return 0;
			}
		}
		ThreadWithIndex(index){
			var filtered = this._threads.filter(t => {
				if (t.threadIndex == index) return t;
			});

			return filtered[0];
		}
	}

	//still needs:

	class VariablesState{
		constructor(callStack, listDefsOrigin){
			this._globalVariables = {};
			this._defaultGlobalVariables = {};
			this._callStack = callStack;
			this._listDefsOrigin = listDefsOrigin;

			this._batchObservingVariableChanges = null;
			this._changedVariables = null;

			//the way variableChangedEvent is a bit different than the reference implementation. Originally it uses the C# += operator to add delegates, but in js we need to maintain an actual collection of delegates (ie. callbacks)
			//to register a new one, there is a special ObserveVariableChange method below.
			this.variableChangedEvent = null;
			this.variableChangedEventCallbacks = [];

			//if es6 proxies are available, use them.
			try{
				//the proxy is used to allow direct manipulation of global variables. It first tries to access the objetcs own property, and if none is found it delegates the call to the $ method, defined below
				var p = new Proxy(this, {
					get: function(target, name){
						return (name in target) ? target[name] : target.$(name);
					},
					set: function(target, name, value){
						if (name in target) target[name] = value;
						else target.$(name, value);
						return true;//returning a fasly value make sthe trap fail
					}
				});

				return p;
			}
			catch(e){
				//thr proxy object is not available in this context. we should warn the dev but writting to the console feels a bit intrusive.
	//			console.log("ES6 Proxy not available - direct manipulation of global variables can't work, use $() instead.");
			}
		}
		get callStack(){
			return this._callStack;
		}
		set callStack(callStack){
			this._callStack = callStack;
		}
		get batchObservingVariableChanges(){
			return this._batchObservingVariableChanges;
		}
		set batchObservingVariableChanges(value){
			value = !!value;
			this._batchObservingVariableChanges = value;
			if (value) {
				this._changedVariables = [];
			}

			// Finished observing variables in a batch - now send
			// notifications for changed variables all in one go.
			else {
				if (this._changedVariables != null) {
					this._changedVariables.forEach(variableName => {
						var currentValue = this._globalVariables[variableName];
						this.variableChangedEvent(variableName, currentValue);
					});
				}

				this._changedVariables = null;
			}
		}
		get jsonToken(){
			return JsonSerialisation.DictionaryRuntimeObjsToJObject(this._globalVariables);
		}
		set jsonToken(value){
			this._globalVariables = JsonSerialisation.JObjectToDictionaryRuntimeObjs(value);
		}

		/**
		 * This function is specific to the js version of ink. It allows to register a callback that will be called when a variable changes. The original code uses `state.variableChangedEvent += callback` instead.
		 * @param {function} callback
		 */
		ObserveVariableChange(callback){
			if (this.variableChangedEvent == null){
				this.variableChangedEvent = (variableName, newValue) => {
					this.variableChangedEventCallbacks.forEach(cb => {
						cb(variableName, newValue);
					});
				};
			}

			this.variableChangedEventCallbacks.push(callback);
		}
		CopyFrom(toCopy){
			this._globalVariables = Object.assign({}, toCopy._globalVariables);
			this._defaultGlobalVariables = Object.assign({}, toCopy._defaultGlobalVariables);

			this.variableChangedEvent = toCopy.variableChangedEvent;

			if (toCopy.batchObservingVariableChanges != this.batchObservingVariableChanges) {

				if (toCopy.batchObservingVariableChanges) {
					this._batchObservingVariableChanges = true;
					this._changedVariables = toCopy._changedVariables;
				} else {
					this._batchObservingVariableChanges = false;
					this._changedVariables = null;
				}
			}
		}
		GlobalVariableExistsWithName(name){
			return typeof this._globalVariables[name] !== 'undefined';
		}
		GetVariableWithName(name,contextIndex){
			if (typeof contextIndex === 'undefined') contextIndex = -1;

			var varValue = this.GetRawVariableWithName(name, contextIndex);

			// Get value from pointer?
	//		var varPointer = varValue as VariablePointerValue;
			var varPointer = varValue;
			if (varPointer instanceof VariablePointerValue) {
				varValue = this.ValueAtVariablePointer(varPointer);
			}

			return varValue;
		}
		TryGetDefaultVariableValue (name)
		{
			var val = _defaultGlobalVariables[name];
			if (typeof val === 'undefined') val = null;
			return val;
		}
		GetRawVariableWithName(name, contextIndex){
			var varValue = null;

			// 0 context = global
			if (contextIndex == 0 || contextIndex == -1) {
				if ( varValue = this._globalVariables[name] )
					return varValue;

				var listItemValue = this._listDefsOrigin.FindSingleItemListWithName(name);
				if (listItemValue)
					return listItemValue;
			}

			// Temporary
			varValue = this._callStack.GetTemporaryVariableWithName(name, contextIndex);

			return varValue;
		}
		ValueAtVariablePointer(pointer){
			 return this.GetVariableWithName(pointer.variableName, pointer.contextIndex);
		}
		Assign(varAss, value){
			var name = varAss.variableName;
			var contextIndex = -1;

			// Are we assigning to a global variable?
			var setGlobal = false;
			if (varAss.isNewDeclaration) {
				setGlobal = varAss.isGlobal;
			} else {
				setGlobal = !!this._globalVariables[name];
			}

			// Constructing new variable pointer reference
			if (varAss.isNewDeclaration) {
	//			var varPointer = value as VariablePointerValue;
				var varPointer = value;
				if (varPointer instanceof VariablePointerValue) {
					var fullyResolvedVariablePointer = this.ResolveVariablePointer(varPointer);
					value = fullyResolvedVariablePointer;
				}

			}

			// Assign to existing variable pointer?
			// Then assign to the variable that the pointer is pointing to by name.
			else {

				// De-reference variable reference to point to
				var existingPointer = null;
				do {
	//				existingPointer = GetRawVariableWithName (name, contextIndex) as VariablePointerValue;
					existingPointer = this.GetRawVariableWithName(name, contextIndex);
					if (existingPointer instanceof VariablePointerValue) {
						name = existingPointer.variableName;
						contextIndex = existingPointer.contextIndex;
						setGlobal = (contextIndex == 0);
					}
				} while(existingPointer instanceof VariablePointerValue);
			}


			if (setGlobal) {
				this.SetGlobal(name, value);
			} else {
				this._callStack.SetTemporaryVariable(name, value, varAss.isNewDeclaration, contextIndex);
			}
		}

		SnapshotDefaultGlobals(){
			this._defaultGlobalVariables = Object.assign({}, this._globalVariables);
		}

		RetainListOriginsForAssignment(oldValue, newValue){
	//		var oldList = oldValue as ListValue;
			var oldList = oldValue;
	//		var newList = newValue as ListValue;
			var newList = newValue;

			if (oldList instanceof ListValue && newList instanceof ListValue && newList.value.Count == 0)
				newList.value.SetInitialOriginNames(oldList.value.originNames);
		}
		SetGlobal(variableName, value){
			var oldValue = null;
			oldValue = this._globalVariables[variableName];

			ListValue.RetainListOriginsForAssignment(oldValue, value);

			this._globalVariables[variableName] = value;

			if (this.variableChangedEvent != null && value !== oldValue) {

				if (this.batchObservingVariableChanges) {
					this._changedVariables.push(variableName);
				} else {
					this.variableChangedEvent(variableName, value);
				}
			}
		}
		ResolveVariablePointer(varPointer){
			var contextIndex = varPointer.contextIndex;

			if( contextIndex == -1 )
				contextIndex = this.GetContextIndexOfVariableNamed(varPointer.variableName);

			var valueOfVariablePointedTo = this.GetRawVariableWithName(varPointer.variableName, contextIndex);

			// Extra layer of indirection:
			// When accessing a pointer to a pointer (e.g. when calling nested or
			// recursive functions that take a variable references, ensure we don't create
			// a chain of indirection by just returning the final target.
	//		var doubleRedirectionPointer = valueOfVariablePointedTo as VariablePointerValue;
			var doubleRedirectionPointer = valueOfVariablePointedTo;
			if (doubleRedirectionPointer instanceof VariablePointerValue) {
				return doubleRedirectionPointer;
			}

			// Make copy of the variable pointer so we're not using the value direct from
			// the runtime. Temporary must be local to the current scope.
			else {
				return new VariablePointerValue(varPointer.variableName, contextIndex);
			}
		}
		GetContextIndexOfVariableNamed(varName){
			if (this._globalVariables[varName])
				return 0;

			return this._callStack.currentElementIndex;
		}
		//the original code uses a magic getter and setter for global variables, allowing things like variableState['varname]. This is not quite possible in js without a Proxy, so it is replaced with this $ function.
		$(variableName, value){
			if (typeof value === 'undefined'){
				var varContents = this._globalVariables[variableName];

				if ( typeof varContents === 'undefined' ) {
					varContents = this._defaultGlobalVariables[variableName];
				}

				if ( typeof varContents !== 'undefined' )
		//			return (varContents as Runtime.Value).valueObject;
					return varContents.valueObject;
				else
					return null;
			}
			else{
				if (typeof this._defaultGlobalVariables[variableName] === 'undefined')
					throw new StoryException("Cannot assign to a variable that hasn't been declared in the story");

				var val = Value.Create(value);
				if (val == null) {
					if (value == null) {
						throw new StoryException("Cannot pass null to VariableState");
					} else {
						throw new StoryException("Invalid value passed to VariableState: "+value.toString());
					}
				}

				this.SetGlobal(variableName, val);
			}
		}
	}

	//Taken from https://gist.github.com/blixt/f17b47c62508be59987b
	//Ink uses a seedable PRNG of which there is none in native javascript.
	class PRNG{
		constructor(seed){
			this._seed = seed % 2147483647;
	  		if (this._seed <= 0) this._seed += 2147483646;
		}
		next(){
			return this._seed = this._seed * 16807 % 2147483647;
		}
		nextFloat(){
			return (this.next() - 1) / 2147483646;
		}
	}

	class StoryState{
		constructor(story){
			//actual constructor
			this.story = story;

			this._outputStream = [];
			this._outputStreamTextDirty = true;
			this._outputStreamTagsDirty = true;
			this.OutputStreamDirty();

			this._evaluationStack = [];

			this.callStack = new CallStack(story.rootContentContainer);
			this._variablesState = new VariablesState(this.callStack, story.listDefinitions);

			this._visitCounts = {};
			this._turnIndices = {};
			this._currentTurnIndex = -1;

			this.divertedPointer = Pointer.Null;

			var timeSeed = (new Date()).getTime();
			this.storySeed = (new PRNG(timeSeed)).next() % 100;
			this.previousRandom = 0;

			this._currentChoices = [];
			this._currentText = null;
			this._currentTags = null;
			this._currentErrors = null;
			this._currentWarnings = null;

			this.didSafeExit = false;

			this.GoToStart();
		}
		get currentChoices(){
			// If we can continue generating text content rather than choices,
			// then we reflect the choice list as being empty, since choices
			// should always come at the end.
			if ( this.canContinue ) return [];
			return this._currentChoices;
		}
		get generatedChoices(){
			return this._currentChoices;
		}
		get currentErrors(){
			return this._currentErrors;
		}
		get currentWarnings(){
			return this._currentWarnings;
		}
		get visitCounts(){
			return this._visitCounts;
		}
		get turnIndices(){
			return this._turnIndices;
		}
		get currentTurnIndex(){
			return this._currentTurnIndex;
		}
		get variablesState(){
			return this._variablesState;
		}
		get currentContentObject(){
			return this.callStack.currentElement.currentObject;
		}
		set currentContentObject(value){
			this.callStack.currentElement.currentObject = value;
		}
		get canContinue(){
			return !this.currentPointer.isNull && !this.hasError;
		}
		get hasError(){
			return this.currentErrors != null && this.currentErrors.length > 0;
		}
		get hasWarning(){
			return this.currentWarnings != null && this.currentWarnings.length > 0;
		}
		get inExpressionEvaluation(){
			return this.callStack.currentElement.inExpressionEvaluation;
		}
		set inExpressionEvaluation(value){
			this.callStack.currentElement.inExpressionEvaluation = value;
		}
		get evaluationStack(){
			return this._evaluationStack;
		}
		get outputStreamEndsInNewline(){
			if (this._outputStream.length > 0) {

				for (var i = this._outputStream.length - 1; i >= 0; i--) {
					var obj = this._outputStream[i];
					if (obj instanceof ControlCommand) // e.g. BeginString
						break;
					var text = this._outputStream[i];
					if (text instanceof StringValue) {
						if (text.isNewline)
							return true;
						else if (text.isNonWhitespace)
							break;
					}
				}
			}

			return false;
		}
		get outputStreamContainsContent(){
			for (var i = 0; i < this._outputStream.length; i++){
				if (this._outputStream[i] instanceof StringValue)
					return true;
			}
			return false;
		}
		get inStringEvaluation(){
			for (var i = this._outputStream.length - 1; i >= 0; i--) {
	//			var cmd = this._outputStream[i] as ControlCommand;
				var cmd = this._outputStream[i];
				if (cmd instanceof ControlCommand && cmd.commandType == ControlCommand.CommandType.BeginString) {
					return true;
				}
			}

			return false;
		}
		get currentText(){
			if( this._outputStreamTextDirty ) {
				var sb = new StringBuilder();

				this._outputStream.forEach(outputObj => {
		//			var textContent = outputObj as StringValue;
					var textContent = outputObj;
					if (textContent instanceof StringValue) {
						sb.Append(textContent.value);
					}
				});

				this._currentText = this.CleanOutputWhitespace(sb.toString());
				this._outputStreamTextDirty = false;
			}

			return this._currentText;
		}
		get currentTags(){
			if( this._outputStreamTagsDirty ) {
				this._currentTags = [];

				this._outputStream.forEach(outputObj => {
		//			var tag = outputObj as Tag;
					var tag = outputObj;
					if (tag instanceof Tag) {
						this._currentTags.push(tag.text);
					}
				});

				this._outputStreamTagsDirty = false;
			}

			return this._currentTags;
		}
		get outputStream(){
			return this._outputStream;
		}
		get currentPathString(){
			var pointer = this.currentPointer;
			if (pointer.isNull)
				return null;
			else
				return pointer.path.toString();
		}
		get currentPointer(){
			return this.callStack.currentElement.currentPointer.copy();
		}
		set currentPointer(value){
			this.callStack.currentElement.currentPointer = value.copy();
		}
		get previousPointer(){
			return this.callStack.currentThread.previousPointer.copy();
		}
		set previousPointer(value){
			this.callStack.currentThread.previousPointer = value.copy();
		}
		get callstackDepth(){
			return this.callStack.depth;
		}
		get jsonToken(){
			var obj = {};

			var choiceThreads = null;
			this._currentChoices.forEach(c => {
				c.originalThreadIndex = c.threadAtGeneration.threadIndex;

				if( this.callStack.ThreadWithIndex(c.originalThreadIndex) == null ) {
					if( choiceThreads == null )
						choiceThreads = {};

					choiceThreads[c.originalThreadIndex.toString()] = c.threadAtGeneration.jsonToken;
				}
			});

			if( this.choiceThreads != null )
				obj["choiceThreads"] = this.choiceThreads;


			obj["callstackThreads"] = this.callStack.GetJsonToken();
			obj["variablesState"] = this.variablesState.jsonToken;

			obj["evalStack"] = JsonSerialisation.ListToJArray(this.evaluationStack);

			obj["outputStream"] = JsonSerialisation.ListToJArray(this._outputStream);

			obj["currentChoices"] = JsonSerialisation.ListToJArray(this._currentChoices);

			if(!this.divertedPointer.isNull)
				obj["currentDivertTarget"] = this.divertedPointer.path.componentsString;

			obj["visitCounts"] = JsonSerialisation.IntDictionaryToJObject(this.visitCounts);
			obj["turnIndices"] = JsonSerialisation.IntDictionaryToJObject(this.turnIndices);
			obj["turnIdx"] = this.currentTurnIndex;
			obj["storySeed"] = this.storySeed;

			obj["inkSaveVersion"] = StoryState.kInkSaveStateVersion;

			// Not using this right now, but could do in future.
			obj["inkFormatVersion"] = this.story.inkVersionCurrent;

			return obj;
		}
		set jsonToken(value){
			var jObject = value;

			var jSaveVersion = jObject["inkSaveVersion"];
			if (jSaveVersion == null) {
				throw new StoryException("ink save format incorrect, can't load.");
			}
			else if (parseInt(jSaveVersion) < StoryState.kMinCompatibleLoadVersion) {
				throw new StoryException("Ink save format isn't compatible with the current version (saw '"+jSaveVersion+"', but minimum is "+StoryState.kMinCompatibleLoadVersion+"), so can't load.");
			}

			this.callStack.SetJsonToken(jObject["callstackThreads"], this.story);
			this.variablesState.jsonToken = jObject["variablesState"];

			this._evaluationStack = JsonSerialisation.JArrayToRuntimeObjList(jObject["evalStack"]);

			this._outputStream = JsonSerialisation.JArrayToRuntimeObjList(jObject["outputStream"]);
			this.OutputStreamDirty();

	//		currentChoices = Json.JArrayToRuntimeObjList<Choice>((JArray)jObject ["currentChoices"]);
			this._currentChoices = JsonSerialisation.JArrayToRuntimeObjList(jObject["currentChoices"]);

			var currentDivertTargetPath = jObject["currentDivertTarget"];
			if (currentDivertTargetPath != null) {
				var divertPath = new Path$1(currentDivertTargetPath.toString());
				this.divertedPointer = this.story.PointerAtPath(divertPath);
			}

			this._visitCounts = JsonSerialisation.JObjectToIntDictionary(jObject["visitCounts"]);
			this._turnIndices = JsonSerialisation.JObjectToIntDictionary(jObject["turnIndices"]);
			this._currentTurnIndex = parseInt(jObject["turnIdx"]);
			this.storySeed = parseInt(jObject["storySeed"]);

	//		var jChoiceThreads = jObject["choiceThreads"] as JObject;
			var jChoiceThreads = jObject["choiceThreads"];

			this._currentChoices.forEach(c => {
				var foundActiveThread = this.callStack.ThreadWithIndex(c.originalThreadIndex);
				if( foundActiveThread != null ) {
					c.threadAtGeneration = foundActiveThread;
				} else {
					var jSavedChoiceThread = jChoiceThreads[c.originalThreadIndex.toString()];
					c.threadAtGeneration = new CallStack.Thread(jSavedChoiceThread, this.story);
				}
			});
		}

		CleanOutputWhitespace (str){
			var sb = new StringBuilder();

			var currentWhitespaceStart = -1;

			for (var i = 0; i < str.length; i++) {
				var c = str.charAt(i);

				var isInlineWhitespace = (c == ' ') || (c == '\t');

				if (isInlineWhitespace && currentWhitespaceStart == -1)
					currentWhitespaceStart = i;

				if (!isInlineWhitespace) {
					if (c != '\n' && currentWhitespaceStart > 0) {
						sb.Append(str.substr(currentWhitespaceStart, i - currentWhitespaceStart));
					}
					currentWhitespaceStart = -1;
				}

				if (!isInlineWhitespace)
					sb.Append(c);
			}

			return sb.toString();
		}

		GoToStart(){
			this.callStack.currentElement.currentPointer = Pointer.StartOf(this.story.mainContentContainer);
		}
		ResetErrors(){
			this._currentErrors = null;
			this._currentWarnings = null;
		}
		ResetOutput(objs){
			objs = (typeof objs !== 'undefined') ? objs : null;
			this._outputStream.length = 0;
			if (objs != null) this._outputStream.push.apply(this._outputStream, objs);
			this.OutputStreamDirty();
		}
		PushEvaluationStack(obj){
	//		var listValue = obj as ListValue;
			var listValue = obj;
			if (listValue instanceof ListValue) {

				// Update origin when list is has something to indicate the list origin
				var rawList = listValue.value;

				if (rawList.originNames != null) {
				if (!rawList.origins) rawList.origins = [];
				rawList.origins.length = 0;

				rawList.originNames.forEach(n => {
					var def = null;
					def = this.story.listDefinitions.TryListGetDefinition(n, def);
					if (rawList.origins.indexOf(def) < 0) rawList.origins.push(def);
				});
				}
			}

			this.evaluationStack.push(obj);
		}
		PopEvaluationStack(numberOfObjects){
			if (!numberOfObjects){
				var obj = this.evaluationStack.pop();
				return obj;
			}
			else{
				if(numberOfObjects > this.evaluationStack.length) {
					throw "trying to pop too many objects";
				}

				var popped = this.evaluationStack.splice(this.evaluationStack.length - numberOfObjects, numberOfObjects);
				return popped;
			}
		}
		PeekEvaluationStack(){
			 return this.evaluationStack[this.evaluationStack.length - 1];
		}
		PushToOutputStream(obj){
	//		var text = obj as StringValue;
			var text = obj;
			if (text instanceof StringValue) {
				var listText = this.TrySplittingHeadTailWhitespace(text);
				if (listText != null) {
					listText.forEach(textObj => {
						this.PushToOutputStreamIndividual(textObj);
					});
					this.OutputStreamDirty();
					return;
				}
			}

			this.PushToOutputStreamIndividual(obj);
			this.OutputStreamDirty();
		}
		PopFromOutputStream(count){
			this.outputStream.splice(this.outputStream.length - count, count);
			this.OutputStreamDirty();
		}
		TrySplittingHeadTailWhitespace(single){
			var str = single.value;

			var headFirstNewlineIdx = -1;
			var headLastNewlineIdx = -1;
			for (var i = 0; i < str.length; ++i) {
				var c = str[i];
				if (c == '\n') {
					if (headFirstNewlineIdx == -1)
						headFirstNewlineIdx = i;
					headLastNewlineIdx = i;
				}
				else if (c == ' ' || c == '\t')
					continue;
				else
					break;
			}

			var tailLastNewlineIdx = -1;
			var tailFirstNewlineIdx = -1;
			for (var i = 0; i < str.length; ++i) {
				var c = str[i];
				if (c == '\n') {
					if (tailLastNewlineIdx == -1)
						tailLastNewlineIdx = i;
					tailFirstNewlineIdx = i;
				}
				else if (c == ' ' || c == '\t')
					continue;
				else
					break;
			}

			// No splitting to be done?
			if (headFirstNewlineIdx == -1 && tailLastNewlineIdx == -1)
				return null;

			var listTexts = [];
			var innerStrStart = 0;
			var innerStrEnd = str.length;

			if (headFirstNewlineIdx != -1) {
				if (headFirstNewlineIdx > 0) {
					var leadingSpaces = str.substring(0, headFirstNewlineIdx);
					listTexts.push(leadingSpaces);
				}
				listTexts.push(new StringValue("\n"));
				innerStrStart = headLastNewlineIdx + 1;
			}

			if (tailLastNewlineIdx != -1) {
				innerStrEnd = tailFirstNewlineIdx;
			}

			if (innerStrEnd > innerStrStart) {
				var innerStrText = str.substring(innerStrStart, innerStrEnd - innerStrStart);
				listTexts.push(new StringValue(innerStrText));
			}

			if (tailLastNewlineIdx != -1 && tailFirstNewlineIdx > headLastNewlineIdx) {
				listTexts.push(new StringValue("\n"));
				if (tailLastNewlineIdx < str.length - 1) {
					var numSpaces = (str.length - tailLastNewlineIdx) - 1;
					var trailingSpaces = new StringValue(str.substring(tailLastNewlineIdx + 1, numSpaces));
					listTexts.push(trailingSpaces);
				}
			}

			return listTexts;
		}
		PushToOutputStreamIndividual(obj){
			var glue = obj;
			var text = obj;

			var includeInOutput = true;

			if (glue instanceof Glue) {
				this.TrimNewlinesFromOutputStream();
				includeInOutput = true;
			}

			else if( text instanceof StringValue ) {

				var functionTrimIndex = -1;
				var currEl = this.callStack.currentElement;
				if (currEl.type == PushPopType.Function) {
					functionTrimIndex = currEl.functionStartInOutputStream;
				}

				var glueTrimIndex = -1;
				for (var i = this._outputStream.length - 1; i >= 0; i--) {
					var o = this._outputStream[i];
					var c = (o instanceof ControlCommand) ? o : null;
					var g = (o instanceof Glue) ? o : null;

					if (g != null) {
						glueTrimIndex = i;
						break;
					}

					else if (c != null && c.commandType == ControlCommand.CommandType.BeginString) {
						if (i >= functionTrimIndex) {
							functionTrimIndex = -1;
						}
						break;
					}
				}

				var trimIndex = -1;
				if (glueTrimIndex != -1 && functionTrimIndex != -1)
					trimIndex = Math.min(functionTrimIndex, glueTrimIndex);
				else if (glueTrimIndex != -1)
					trimIndex = glueTrimIndex;
				else
					trimIndex = functionTrimIndex;

				if (trimIndex != -1) {

					if (text.isNewline) {
						includeInOutput = false;
					}

					else if (text.isNonWhitespace) {

						if (glueTrimIndex > -1)
							this.RemoveExistingGlue();

						if (functionTrimIndex > -1) {
							var callStackElements = this.callStack.elements;
							for (var i = callStackElements.length - 1; i >= 0; i--) {
								var el = callStackElements[i];
								if (el.type == PushPopType.Function) {
									el.functionStartInOutputStream = -1;
								} else {
									break;
								}
							}
						}
					}
				}

				else if (text.isNewline) {
					if (this.outputStreamEndsInNewline || !this.outputStreamContainsContent)
						includeInOutput = false;
				}
			}

			if (includeInOutput) {
				this._outputStream.push(obj);
				this.OutputStreamDirty();
			}
		}
		TrimNewlinesFromOutputStream(rightGlueToStopAt){
			var removeWhitespaceFrom = -1;

			var i = this._outputStream.length-1;
			while (i >= 0) {
				var obj = this._outputStream[i];
				var cmd = (obj instanceof ControlCommand) ? obj : null;
				var txt = (obj instanceof StringValue) ? obj : null;

				if (cmd != null || (txt != null && txt.isNonWhitespace)) {
					break;
				} else if (txt != null && txt.isNewline) {
					removeWhitespaceFrom = i;
				}
				i--;
			}

			// Remove the whitespace
			if (removeWhitespaceFrom >= 0) {
				i=removeWhitespaceFrom;
				while(i < this._outputStream.length) {
	//				var text = _outputStream [i] as StringValue;
					var text = this._outputStream[i];
					if (text instanceof StringValue) {
						this._outputStream.splice(i, 1);
					} else {
						i++;
					}
				}
			}

			this.OutputStreamDirty();
		}
		RemoveExistingGlue(){
			for (var i = this._outputStream.length - 1; i >= 0; i--) {
				var c = this._outputStream[i];
				if (c instanceof Glue) {
					this._outputStream.splice(i, 1);
				} else if( c instanceof ControlCommand ) { // e.g. BeginString
					break;
				}
			}

			this.OutputStreamDirty();
		}
		ForceEnd(){
			while (this.callStack.canPopThread)
				this.callStack.PopThread();

			while (this.callStack.canPop)
				this.PopCallStack();

			this._currentChoices.length = 0;

			this.currentPointer = Pointer.Null;
			this.previousPointer = Pointer.Null;

			this.didSafeExit = true;
		}
		TrimWhitespaceFromFunctionEnd(){
			// Debug.Assert (callStack.currentElement.type == PushPopType.Function);
			var functionStartPoint = this.callStack.currentElement.functionStartInOutputStream;

			if (functionStartPoint == -1) {
				functionStartPoint = 0;
			}

			for (var i = this._outputStream.length - 1; i >= functionStartPoint; i--) {
				var obj = this._outputStream[i];
				var txt = (obj instanceof StringValue) ? obj : null;
				var cmd = (obj instanceof ControlCommand) ? obj : null;

				if (txt == null) continue;
				if (cmd) break;

				if (txt.isNewline || txt.isInlineWhitespace) {
					this._outputStream.splice(i, 1);
					this.OutputStreamDirty();
				} else {
					break;
				}
			}
		}
		PopCallStack(popType) {
			popType = (typeof popType !== 'undefined') ? popType : null;

			if (this.callStack.currentElement.type == PushPopType.Function)
				this.TrimWhitespaceFromFunctionEnd();

			this.callStack.Pop(popType);
		}
		SetChosenPath(path){
			// Changing direction, assume we need to clear current set of choices
			this._currentChoices.length = 0;

			var newPointer = this.story.PointerAtPath(path);
			if (!newPointer.isNull && newPointer.index == -1)
				newPointer.index = 0;

			this.currentPointer = newPointer;

			this._currentTurnIndex++;
		}
		StartFunctionEvaluationFromGame(funcContainer, args){
			this.callStack.Push(PushPopType.FunctionEvaluationFromGame, this.evaluationStack.length);
			this.callStack.currentElement.currentPointer = Pointer.StartOf(funcContainer);

			this.PassArgumentsToEvaluationStack(args);
		}
		PassArgumentsToEvaluationStack(args){
			// Pass arguments onto the evaluation stack
			if (args != null) {
				for (var i = 0; i < args.length; i++) {
					if (!(typeof args[i] === 'number' || typeof args[i] === 'string')) {
						throw "ink arguments when calling EvaluateFunction / ChoosePathStringWithParameters  must be int, float or string";
					}

					this.PushEvaluationStack(Value.Create(args[i]));
				}
			}
		}
		TryExitFunctionEvaluationFromGame(){
			if (this.callStack.currentElement.type == PushPopType.FunctionEvaluationFromGame) {
				this.currentPointer = Pointer.Null;
				this.didSafeExit = true;
				return true;
			}

			return false;
		}
		CompleteFunctionEvaluationFromGame(){
			if (this.callStack.currentElement.type != PushPopType.FunctionEvaluationFromGame) {
				throw new StoryException("Expected external function evaluation to be complete. Stack trace: "+callStack.callStackTrace);
			}

			var originalEvaluationStackHeight = this.callStack.currentElement.evaluationStackHeightWhenPushed;
			// Do we have a returned value?
			// Potentially pop multiple values off the stack, in case we need
			// to clean up after ourselves (e.g. caller of EvaluateFunction may
			// have passed too many arguments, and we currently have no way to check for that)
			var returnedObj = null;
			while (this.evaluationStack.length > originalEvaluationStackHeight) {
				var poppedObj = this.PopEvaluationStack();
				if (returnedObj == null)
					returnedObj = poppedObj;
			}

			this.PopCallStack(PushPopType.FunctionEvaluationFromGame);

			if (returnedObj) {
				if (returnedObj instanceof Void)
					return null;

				// Some kind of value, if not void
	//			var returnVal = returnedObj as Runtime.Value;
				var returnVal = returnedObj;

				// DivertTargets get returned as the string of components
				// (rather than a Path, which isn't public)
				if (returnVal.valueType == ValueType.DivertTarget) {
					return returnVal.valueObject.toString();
				}

				// Other types can just have their exact object type:
				// int, float, string. VariablePointers get returned as strings.
				return returnVal.valueObject;
			}

			return null;
		}
		AddError(message, isWarning){
			if (!isWarning) {
				if (this._currentErrors == null) this._currentErrors = [];
				this._currentErrors.push(message);
			} else {
				if (this._currentWarnings == null) this._currentWarnings = [];
				this._currentWarnings.push(message);
			}
		}
		OutputStreamDirty(){
			this._outputStreamTextDirty = true;
			this._outputStreamTagsDirty = true;
		}
		VisitCountAtPathString(pathString){
			var visitCountOut;
			if (visitCountOut = this.visitCounts[pathString])
				return visitCountOut;

			return 0;
		}
		Copy(){
			var copy = new StoryState(this.story);

			copy.outputStream.push.apply(copy.outputStream, this._outputStream);
			this.OutputStreamDirty();

			copy._currentChoices.push.apply(copy._currentChoices, this._currentChoices);

			if (this.hasError) {
				copy._currentErrors = [];
				copy._currentErrors.push.apply(copy._currentErrors, this.currentErrors);
			}

			if (this.hasWarning) {
				copy._currentWarnings = [];
				copy._currentWarnings.push.apply(copy._currentWarnings, this.currentWarnings);
			}

			copy.callStack = new CallStack(this.callStack);

			copy._variablesState = new VariablesState(copy.callStack, this.story.listDefinitions);
			copy.variablesState.CopyFrom(this.variablesState);

			copy.evaluationStack.push.apply(copy.evaluationStack, this.evaluationStack);

			if (!this.divertedPointer.isNull)
				copy.divertedPointer = this.divertedPointer.copy();

			copy.previousPointer = this.previousPointer.copy();

			copy._visitCounts = {};
			for (var keyValue in this._visitCounts) {
			      	copy._visitCounts[keyValue] = this._visitCounts[keyValue];
			}
			copy._turnIndices = {};
			for (var keyValue in this._turnIndices) {
				copy._turnIndices[keyValue] = this._turnIndices[keyValue];
			}

			copy._currentTurnIndex = this.currentTurnIndex;
			copy.storySeed = this.storySeed;
			copy.previousRandom = this.previousRandom;

			copy.didSafeExit = this.didSafeExit;

			return copy;
		}

		ToJson(indented){
			return JSON.stringify(this.jsonToken, null, (indented) ? 2 : 0);
		}
		toJson(indented){
			return this.ToJson(indented);
		}
		LoadJson(jsonString){
			this.jsonToken = JSON.parse(jsonString);
		}
	}

	StoryState.kInkSaveStateVersion = 8;
	StoryState.kMinCompatibleLoadVersion = 8;

	// This is simple replacement of the Stopwatch class from the .NET Framework.
	// The original class can count time with much more accuracy than the Javascript version.
	// It might be worth considering using `window.performance` in the browser
	// or `process.hrtime()` in node.
	class Stopwatch {
		constructor(){
			this.startTime;
		}

		get ElapsedMilliseconds(){
			return (new Date().getTime()) - this.startTime;
		}

		Start(){
			this.startTime = new Date().getTime();
		}
		Stop(){
			this.startTime = undefined;
		}
	}

	if (!Number.isInteger) {
		Number.isInteger = function isInteger (nVal) {
			return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
		};
	}

	class Story extends Object$1{
		constructor(jsonString, lists){
			super();

			lists = lists || null;

			this.inkVersionCurrent = 18;
			this.inkVersionMinimumCompatible = 18;

			this._variableObservers = null;
			this._externals = {};
			this._prevContainers = [];
			this._listDefinitions = null;

			this._asyncContinueActive;
			this._stateAtLastNewline = null;
			this._recursiveContinueCount = 0;
			this._temporaryEvaluationContainer = null;

			this._profiler = null;

			if (jsonString instanceof Container){
				this._mainContentContainer = jsonString;

				if (lists != null)
					this._listDefinitions = new ListDefinitionsOrigin(lists);
			}
			else{
				//the original version only accepts a string as a constructor, but this is javascript and it's almost easier to get a JSON value than a string, so we're silently accepting both
				var rootObject = (typeof jsonString === 'string') ? JSON.parse(jsonString) : jsonString;

				var versionObj = rootObject["inkVersion"];
				if (versionObj == null)
					throw "ink version number not found. Are you sure it's a valid .ink.json file?";

				var formatFromFile = parseInt(versionObj);
				if (formatFromFile > this.inkVersionCurrent){
					throw "Version of ink used to build story was newer than the current version of the engine";
				}
				else if (formatFromFile < this.inkVersionMinimumCompatible){
					throw "Version of ink used to build story is too old to be loaded by this version of the engine";
				}
				else if (formatFromFile != this.inkVersionCurrent){
					console.warn("WARNING: Version of ink used to build story doesn't match current version of engine. Non-critical, but recommend synchronising.");
				}

				var rootToken = rootObject["root"];
				if (rootToken == null)
					throw "Root node for ink not found. Are you sure it's a valid .ink.json file?";

				var listDefsObj;
				if (listDefsObj = rootObject["listDefs"]) {
					this._listDefinitions = JsonSerialisation.JTokenToListDefinitions(listDefsObj);
				}

				this._mainContentContainer = JsonSerialisation.JTokenToRuntimeObject(rootToken);

				this._hasValidatedExternals = null;
				this.allowExternalFunctionFallbacks = false;

				this.ResetState();
			}
		}

		get currentChoices(){
			// Don't include invisible choices for external usage.
			var choices = [];

			this._state.currentChoices.forEach(c => {
				if (!c.isInvisibleDefault) {
					c.index = choices.length;
					choices.push(c);
				}
			});

			return choices;
		}
		get currentText(){
			this.IfAsyncWeCant("call currentText since it's a work in progress");
			return this.state.currentText;
		}
		get currentTags(){
			this.IfAsyncWeCant("call currentTags since it's a work in progress");
			return this.state.currentTags;
		}
		get currentErrors(){
			return this.state.currentErrors;
		}
		get currentWarnings(){
			return this.state.currentWarnings;
		}
		get hasError(){
			return this.state.hasError;
		}
		get hasWarning(){
			return this.state.hasWarning;
		}
		get variablesState(){
			return this.state.variablesState;
		}
		get listDefinitions (){
			return this._listDefinitions;
		}
		get state(){
			return this._state;
		}

		get mainContentContainer(){
			if (this._temporaryEvaluationContainer) {
				return this._temporaryEvaluationContainer;
			} else {
				return this._mainContentContainer;
			}
		}
		get canContinue(){
			return this.state.canContinue;
		}
		get asyncContinueComplete(){
			return !this._asyncContinueActive;
		}

		get globalTags(){
			return this.TagsAtStartOfFlowContainerWithPathString("");
		}

		// TODO: Implement Profiler
		StartProfiling(){}
		EndProfiling(){}
		ToJsonString(){
			var rootContainerJsonList = JsonSerialisation.RuntimeObjectToJToken(this._mainContentContainer);

			var rootObject = {};
			rootObject["inkVersion"] = this.inkVersionCurrent;
			rootObject["root"] = rootContainerJsonList;

			if (this._listDefinitions != null)
				rootObject["listDefs"] = JsonSerialisation.ListDefinitionsToJToken(this._listDefinitions);

			return JSON.stringify(rootObject);
		}
		ResetState(){
			this.IfAsyncWeCant("ResetState");

			this._state = new StoryState(this);
			this._state.variablesState.ObserveVariableChange(this.VariableStateDidChangeEvent.bind(this));

			this.ResetGlobals();
		}
		ResetErrors(){
			this._state.ResetErrors();
		}
		ResetCallstack(){
			this.IfAsyncWeCant("ResetCallstack");
			this._state.ForceEnd();
		}
		ResetGlobals(){
			if (this._mainContentContainer.namedContent["global decl"]){
				var originalPointer = this.state.currentPointer.copy();

				this.ChoosePathString("global decl", false);

				// Continue, but without validating external bindings,
				// since we may be doing this reset at initialisation time.
				this.ContinueInternal();

				this.state.currentPointer = originalPointer;
			}

			this.state.variablesState.SnapshotDefaultGlobals();
		}
		Continue(){
			this.ContinueAsync(0);
			return this.currentText;
		}
		ContinueAsync(millisecsLimitAsync){
			if (!this._hasValidatedExternals)
				this.ValidateExternalBindings();

			this.ContinueInternal(millisecsLimitAsync);
		}
		ContinueInternal(millisecsLimitAsync){
			millisecsLimitAsync = (typeof millisecsLimitAsync !== 'undefined') ? millisecsLimitAsync : 0;

			if (this._profiler != null)
				this._profiler.PreContinue();

			var isAsyncTimeLimited = millisecsLimitAsync > 0;
			this._recursiveContinueCount++;

			if (!this._asyncContinueActive) {
				this._asyncContinueActive = isAsyncTimeLimited;

				if (!this.canContinue) {
					throw new StoryException("Can't continue - should check canContinue before calling Continue");
				}

				this._state.didSafeExit = false;
				this._state.ResetOutput();

				if (this._recursiveContinueCount == 1)
					this._state.variablesState.batchObservingVariableChanges = true;
			}

			var durationStopwatch = new Stopwatch();
			durationStopwatch.Start();

			var outputStreamEndsInNewline = false;
			do {
				try {
					outputStreamEndsInNewline = this.ContinueSingleStep();
				} catch (e) {
					if (!(e instanceof StoryException)) throw e;

					this.AddError(e.Message, undefined, e.useEndLineNumber);
					break;
				}

				if (outputStreamEndsInNewline)
					break;


				if (this._asyncContinueActive && durationStopwatch.ElapsedMilliseconds > millisecsLimitAsync) {
					break;
				}

			} while(this.canContinue);

			durationStopwatch.Stop();

			if (outputStreamEndsInNewline || !this.canContinue) {
				if (this._stateAtLastNewline != null) {
					this.RestoreStateSnapshot(this._stateAtLastNewline);
					this._stateAtLastNewline = null;
				}

				if (!this.canContinue) {
					if (this.state.callStack.canPopThread)
						this.AddError("Thread available to pop, threads should always be flat by the end of evaluation?");

					if (this.state.generatedChoices.length == 0 && !this.state.didSafeExit && this._temporaryEvaluationContainer == null) {
						if (this.state.callStack.CanPop(PushPopType.Tunnel))
							this.AddError ("unexpectedly reached end of content. Do you need a '->->' to return from a tunnel?");
						else if (this.state.callStack.CanPop(PushPopType.Function))
							this.AddError ("unexpectedly reached end of content. Do you need a '~ return'?");
						else if (!this.state.callStack.canPop)
							this.AddError ("ran out of content. Do you need a '-> DONE' or '-> END'?");
						else
							this.AddError ("unexpectedly reached end of content for unknown reason. Please debug compiler!");
					}
				}

				this.state.didSafeExit = false;

				if (this._recursiveContinueCount == 1)
					this._state.variablesState.batchObservingVariableChanges = false;

				this._asyncContinueActive = false;
			}

			this._recursiveContinueCount--;

			if (this._profiler != null)
				this._profiler.PostContinue();
		}
		ContinueSingleStep(){
			if (this._profiler != null)
				this._profiler.PreStep();

			this.Step();

			if (this._profiler != null)
				this._profiler.PostStep();

			if (!this.canContinue && !this.state.callStack.elementIsEvaluateFromGame) {
				this.TryFollowDefaultInvisibleChoice();
			}

			if (this._profiler != null)
				this._profiler.PreSnapshot();

			if (!this.state.inStringEvaluation) {

				if (this._stateAtLastNewline != null) {

					var change = this.CalculateNewlineOutputStateChange (
						this._stateAtLastNewline.currentText, this.state.currentText,
						this._stateAtLastNewline.currentTags.length, this.state.currentTags.length
					);

					if (change == OutputStateChange.ExtendedBeyondNewline) {

						this.RestoreStateSnapshot(this._stateAtLastNewline);

						return true;
					}

					else if (change == OutputStateChange.NewlineRemoved) {
						this._stateAtLastNewline = null;
					}
				}

				if (this.state.outputStreamEndsInNewline) {
					if (this.canContinue) {
						if (this._stateAtLastNewline == null)
							this._stateAtLastNewline = this.StateSnapshot();
					}

					else {
						this._stateAtLastNewline = null;
					}
				}
			}

			if (this._profiler != null)
				this._profiler.PostSnapshot();

			return false;
		}
		CalculateNewlineOutputStateChange(prevText, currText, prevTagCount, currTagCount){
			var newlineStillExists = currText.length >= prevText.length && currText.charAt(prevText.length - 1) == '\n';
			if (prevTagCount == currTagCount && prevText.length == currText.length && newlineStillExists)
				return OutputStateChange.NoChange;

			if (!newlineStillExists) {
				return OutputStateChange.NewlineRemoved;
			}

			if (currTagCount > prevTagCount)
				return OutputStateChange.ExtendedBeyondNewline;

			for (var i = prevText.length; i < currText.length; i++) {
				var c = currText.charAt(i);
				if (c != ' ' && c != '\t') {
					return OutputStateChange.ExtendedBeyondNewline;
				}
			}

			return OutputStateChange.NoChange;
		}
		ContinueMaximally(){
			this.IfAsyncWeCant("ContinueMaximally");

			var sb = new StringBuilder();

			while (this.canContinue) {
				sb.Append(this.Continue());
			}

			return sb.toString();
		}
		ContentAtPath(path){
			return this.mainContentContainer.ContentAtPath(path);
		}
		KnotContainerWithName(name){
			var namedContainer = this.mainContentContainer.namedContent[name];
			if (namedContainer instanceof Container)
				return namedContainer;
			else
				return null;
		}
		PointerAtPath(path) {
			if (path.length == 0)
				return Pointer.Null;

			var p = new Pointer();

			var pathLengthToUse = path.length;

			var result = null;
			if (path.lastComponent.isIndex) {
				pathLengthToUse = path.length - 1;
				result = this.mainContentContainer.ContentAtPath(path, undefined, pathLengthToUse);
				p.container = result.container;
				p.index = path.lastComponent.index;
			} else {
				result = this.mainContentContainer.ContentAtPath(path);
				p.container = result.container;
				p.index = -1;
			}

			if (result.obj == null || result.obj == this.mainContentContainer && pathLengthToUse > 0)
				this.Error("Failed to find content at path '" + path + "', and no approximation of it was possible.");
			else if (result.approximate)
				this.Warning("Failed to find content at path '" + path + "', so it was approximated to: '"+result.obj.path+"'.");

			return p;
		}
		StateSnapshot(){
			return this.state.Copy();
		}
		RestoreStateSnapshot(state){
			this._state = state;
		}
		Step(){

			var shouldAddToStream = true;

			// Get current content
			var pointer = this.state.currentPointer.copy();
			if (pointer.isNull) {
				return;
			}
			// Step directly to the first element of content in a container (if necessary)
	//		Container containerToEnter = pointer.Resolve () as Container;
			var containerToEnter = pointer.Resolve();

			while(containerToEnter instanceof Container) {

				// Mark container as being entered
				this.VisitContainer(containerToEnter, true);

				// No content? the most we can do is step past it
				if (containerToEnter.content.length == 0) {
					break;
				}

				pointer = Pointer.StartOf(containerToEnter);
	//			containerToEnter = pointer.Resolve() as Container;
				containerToEnter = pointer.Resolve();
			}

			this.state.currentPointer = pointer.copy();

			if (this._profiler != null)
				this._profiler.Step(state.callStack);

			// Is the current content object:
			//  - Normal content
			//  - Or a logic/flow statement - if so, do it
			// Stop flow if we hit a stack pop when we're unable to pop (e.g. return/done statement in knot
			// that was diverted to rather than called as a function)
			var currentContentObj = pointer.Resolve();
			var isLogicOrFlowControl = this.PerformLogicAndFlowControl(currentContentObj);

			// Has flow been forced to end by flow control above?
			if (this.state.currentPointer.isNull) {
				return;
			}

			if (isLogicOrFlowControl) {
				shouldAddToStream = false;
			}

			// Choice with condition?
	//		var choicePoint = currentContentObj as ChoicePoint;
			var choicePoint = currentContentObj;
			if (choicePoint instanceof ChoicePoint) {
				var choice = this.ProcessChoice(choicePoint);
				if (choice) {
					this.state.generatedChoices.push(choice);
				}

				currentContentObj = null;
				shouldAddToStream = false;
			}

			// If the container has no content, then it will be
			// the "content" itself, but we skip over it.
			if (currentContentObj instanceof Container) {
				shouldAddToStream = false;
			}

			// Content to add to evaluation stack or the output stream
			if (shouldAddToStream) {

				// If we're pushing a variable pointer onto the evaluation stack, ensure that it's specific
				// to our current (possibly temporary) context index. And make a copy of the pointer
				// so that we're not editing the original runtime object.
	//			var varPointer = currentContentObj as VariablePointerValue;
				var varPointer = currentContentObj;
				if (varPointer instanceof VariablePointerValue && varPointer.contextIndex == -1) {

					// Create new object so we're not overwriting the story's own data
					var contextIdx = this.state.callStack.ContextForVariableNamed(varPointer.variableName);
					currentContentObj = new VariablePointerValue(varPointer.variableName, contextIdx);
				}

				// Expression evaluation content
				if (this.state.inExpressionEvaluation) {
					this.state.PushEvaluationStack(currentContentObj);
				}
				// Output stream content (i.e. not expression evaluation)
				else {
					this.state.PushToOutputStream(currentContentObj);
				}
			}

			// Increment the content pointer, following diverts if necessary
			this.NextContent();

			// Starting a thread should be done after the increment to the content pointer,
			// so that when returning from the thread, it returns to the content after this instruction.
	//		var controlCmd = currentContentObj as ControlCommand;
			var controlCmd = currentContentObj;
			if (controlCmd instanceof ControlCommand && controlCmd.commandType == ControlCommand.CommandType.StartThread) {
				this.state.callStack.PushThread();
			}
		}
		VisitContainer(container, atStart){
			if (!container.countingAtStartOnly || atStart) {
				if (container.visitsShouldBeCounted)
					this.IncrementVisitCountForContainer(container);

				if (container.turnIndexShouldBeCounted)
					this.RecordTurnIndexVisitToContainer(container);
			}
		}
		VisitChangedContainersDueToDivert(){
			var previousPointer = this.state.previousPointer.copy();
			var pointer = this.state.currentPointer.copy();

			if (pointer.isNull || pointer.index == -1)
				return;

			// First, find the previously open set of containers
			this._prevContainers.length = 0;
			if (!previousPointer.isNull) {
	//			Container prevAncestor = previousPointer.Resolve() as Container ?? previousPointer.container as Container;
				var resolvedPreviousAncestor = previousPointer.Resolve();
				var prevAncestor = (resolvedPreviousAncestor instanceof Container) ? resolvedPreviousAncestor : previousPointer.container;
				while (prevAncestor instanceof Container) {
					this._prevContainers.push(prevAncestor);
	//				prevAncestor = prevAncestor.parent as Container;
					prevAncestor = prevAncestor.parent;
				}
			}

			// If the new object is a container itself, it will be visited automatically at the next actual
			// content step. However, we need to walk up the new ancestry to see if there are more new containers
			var currentChildOfContainer = pointer.Resolve();

			if (currentChildOfContainer == null) return;

	//		Container currentContainerAncestor = currentChildOfContainer.parent as Container;
			var currentContainerAncestor = currentChildOfContainer.parent;
			while (currentContainerAncestor instanceof Container && this._prevContainers.indexOf(currentContainerAncestor) < 0) {

				// Check whether this ancestor container is being entered at the start,
				// by checking whether the child object is the first.
				var enteringAtStart = currentContainerAncestor.content.length > 0
					&& currentChildOfContainer == currentContainerAncestor.content[0];

				// Mark a visit to this container
				this.VisitContainer(currentContainerAncestor, enteringAtStart);

				currentChildOfContainer = currentContainerAncestor;
	//			currentContainerAncestor = currentContainerAncestor.parent as Container;
				currentContainerAncestor = currentContainerAncestor.parent;
			}
		}
		ProcessChoice(choicePoint){
			var showChoice = true;

			// Don't create choice if choice point doesn't pass conditional
			if (choicePoint.hasCondition) {
				var conditionValue = this.state.PopEvaluationStack();
				if (!this.IsTruthy(conditionValue)) {
					showChoice = false;
				}
			}

			var startText = "";
			var choiceOnlyText = "";

			if (choicePoint.hasChoiceOnlyContent) {
	//			var choiceOnlyStrVal = state.PopEvaluationStack () as StringValue;
				var choiceOnlyStrVal = this.state.PopEvaluationStack();
				choiceOnlyText = choiceOnlyStrVal.value;
			}

			if (choicePoint.hasStartContent) {
	//			var startStrVal = state.PopEvaluationStack () as StringValue;
				var startStrVal = this.state.PopEvaluationStack();
				startText = startStrVal.value;
			}

			// Don't create choice if player has already read this content
			if (choicePoint.onceOnly) {
				var visitCount = this.VisitCountForContainer(choicePoint.choiceTarget);
				if (visitCount > 0) {
					showChoice = false;
				}
			}

			// We go through the full process of creating the choice above so
			// that we consume the content for it, since otherwise it'll
			// be shown on the output stream.
			if (!showChoice) {
				return null;
			}

			var choice = new Choice();
			choice.targetPath = choicePoint.pathOnChoice;
			choice.sourcePath = choicePoint.path.toString();
			choice.isInvisibleDefault = choicePoint.isInvisibleDefault;
			choice.threadAtGeneration = this.state.callStack.currentThread.Copy();

			choice.text = (startText + choiceOnlyText).replace(/^[ \t]+|[ \t]+$/g, '');

			return choice;
		}
		IsTruthy(obj){
			var truthy = false;
			if (obj instanceof Value) {
				var val = obj;

				if (val instanceof DivertTargetValue) {
					var divTarget = val;
					this.Error("Shouldn't use a divert target (to " + divTarget.targetPath + ") as a conditional value. Did you intend a function call 'likeThis()' or a read count check 'likeThis'? (no arrows)");
					return false;
				}

				return val.isTruthy;
			}
			return truthy;
		}
		PerformLogicAndFlowControl(contentObj){
			if( contentObj == null ) {
				return false;
			}

			// Divert
			if (contentObj instanceof Divert) {
				var currentDivert = contentObj;

				if (currentDivert.isConditional) {
					var conditionValue = this.state.PopEvaluationStack();

					// False conditional? Cancel divert
					if (!this.IsTruthy(conditionValue))
						return true;
				}

				if (currentDivert.hasVariableTarget) {
					var varName = currentDivert.variableDivertName;

					var varContents = this.state.variablesState.GetVariableWithName(varName);

					if (varContents == null) {
						this.Error("Tried to divert using a target from a variable that could not be found (" + varName + ")");
					}
					else if (!(varContents instanceof DivertTargetValue)) {

	//					var intContent = varContents as IntValue;
						var intContent = varContents;

						var errorMessage = "Tried to divert to a target from a variable, but the variable (" + varName + ") didn't contain a divert target, it ";
						if (intContent instanceof IntValue && intContent.value == 0) {
							errorMessage += "was empty/null (the value 0).";
						} else {
							errorMessage += "contained '" + varContents + "'.";
						}

						this.Error(errorMessage);
					}

					var target = varContents;
					this.state.divertedPointer = this.PointerAtPath(target.targetPath);

				} else if (currentDivert.isExternal) {
					this.CallExternalFunction(currentDivert.targetPathString, currentDivert.externalArgs);
					return true;
				} else {
					this.state.divertedPointer = currentDivert.targetPointer.copy();
				}

				if (currentDivert.pushesToStack) {
					this.state.callStack.Push(
						currentDivert.stackPushType,
						undefined,
						this.state.outputStream.length
					);
				}

				if (this.state.divertedPointer.isNull && !currentDivert.isExternal) {

					// Human readable name available - runtime divert is part of a hard-written divert that to missing content
					if (currentDivert && currentDivert.debugMetadata.sourceName != null) {
						this.Error("Divert target doesn't exist: " + currentDivert.debugMetadata.sourceName);
					} else {
						this.Error("Divert resolution failed: " + currentDivert);
					}
				}

				return true;
			}

			// Start/end an expression evaluation? Or print out the result?
			else if( contentObj instanceof ControlCommand ) {
				var evalCommand = contentObj;

				switch (evalCommand.commandType) {

				case ControlCommand.CommandType.EvalStart:
					if (this.state.inExpressionEvaluation) console.warn("Already in expression evaluation?");
					this.state.inExpressionEvaluation = true;
					break;

				case ControlCommand.CommandType.EvalEnd:
					if (!this.state.inExpressionEvaluation) console.warn("Not in expression evaluation mode");
					this.state.inExpressionEvaluation = false;
					break;

				case ControlCommand.CommandType.EvalOutput:

					// If the expression turned out to be empty, there may not be anything on the stack
					if (this.state.evaluationStack.length > 0) {

						var output = this.state.PopEvaluationStack();

						// Functions may evaluate to Void, in which case we skip output
						if (!(output instanceof Void)) {
							// TODO: Should we really always blanket convert to string?
							// It would be okay to have numbers in the output stream the
							// only problem is when exporting text for viewing, it skips over numbers etc.
							var text = new StringValue(output.toString());

							this.state.PushToOutputStream(text);
						}

					}
					break;

				case ControlCommand.CommandType.NoOp:
					break;

				case ControlCommand.CommandType.Duplicate:
					this.state.PushEvaluationStack(this.state.PeekEvaluationStack());
					break;

				case ControlCommand.CommandType.PopEvaluatedValue:
					this.state.PopEvaluationStack();
					break;

				case ControlCommand.CommandType.PopFunction:
				case ControlCommand.CommandType.PopTunnel:

					var popType = evalCommand.commandType == ControlCommand.CommandType.PopFunction ?
						PushPopType.Function : PushPopType.Tunnel;

					var overrideTunnelReturnTarget = null;
					if (popType == PushPopType.Tunnel) {
						var popped = this.state.PopEvaluationStack();
	//					overrideTunnelReturnTarget = popped as DivertTargetValue;
						overrideTunnelReturnTarget = popped;
						if (overrideTunnelReturnTarget instanceof DivertTargetValue === false) {
							if (popped instanceof Void === false){
								throw "Expected void if ->-> doesn't override target";
							} else {
								overrideTunnelReturnTarget = null;
							}
						}
					}

					if (this.state.TryExitFunctionEvaluationFromGame()){
						break;
					}
					else if (this.state.callStack.currentElement.type != popType || !this.state.callStack.canPop) {

						var names = {};
						names[PushPopType.Function] = "function return statement (~ return)";
						names[PushPopType.Tunnel] = "tunnel onwards statement (->->)";

						var expected = names[this.state.callStack.currentElement.type];
						if (!this.state.callStack.canPop) {
							expected = "end of flow (-> END or choice)";
						}

						var errorMsg = "Found " + names[popType] + ", when expected " + expected;

						this.Error(errorMsg);
					}

					else {
						this.state.PopCallStack();

						if (overrideTunnelReturnTarget)
							this.state.divertedPointer = this.PointerAtPath(overrideTunnelReturnTarget.targetPath);
					}
					break;

				case ControlCommand.CommandType.BeginString:
					this.state.PushToOutputStream(evalCommand);

					if (!this.state.inExpressionEvaluation) console.warn("Expected to be in an expression when evaluating a string");
					this.state.inExpressionEvaluation = false;
					break;

				case ControlCommand.CommandType.EndString:

					var contentStackForString = [];

					var outputCountConsumed = 0;
					for (var i = this.state.outputStream.length - 1; i >= 0; --i) {
						var obj = this.state.outputStream[i];

						outputCountConsumed++;

	//					var command = obj as ControlCommand;
						var command = obj;
						if (command instanceof ControlCommand && command.commandType == ControlCommand.CommandType.BeginString) {
							break;
						}

						if( obj instanceof StringValue ) {
							contentStackForString.push(obj);
						}
					}

					// Consume the content that was produced for this string
					this.state.PopFromOutputStream(outputCountConsumed);

					//the C# version uses a Stack for contentStackForString, but we're using a simple array, so we need to reverse it before using it
					contentStackForString = contentStackForString.reverse();

					// Build string out of the content we collected
					var sb = new StringBuilder();
					contentStackForString.forEach(c => {
						sb.Append(c.toString());
					});

					// Return to expression evaluation (from content mode)
					this.state.inExpressionEvaluation = true;
					this.state.PushEvaluationStack(new StringValue(sb.toString()));
					break;

				case ControlCommand.CommandType.ChoiceCount:
					var choiceCount = this.state.generatedChoices.length;
					this.state.PushEvaluationStack(new IntValue(choiceCount));
					break;

				case ControlCommand.CommandType.TurnsSince:
				case ControlCommand.CommandType.ReadCount:
					var target = this.state.PopEvaluationStack();
					if( !(target instanceof DivertTargetValue) ) {
						var extraNote = "";
						if( target instanceof IntValue )
							extraNote = ". Did you accidentally pass a read count ('knot_name') instead of a target ('-> knot_name')?";
						this.Error("TURNS_SINCE / READ_COUNT expected a divert target (knot, stitch, label name), but saw "+target+extraNote);
						break;
					}

	//				var divertTarget = target as DivertTargetValue;
					var divertTarget = target;
	//				var container = ContentAtPath (divertTarget.targetPath).correctObj as Container;
					var correctObj = this.ContentAtPath(divertTarget.targetPath).correctObj;
					var container = (correctObj instanceof Container) ? correctObj : null;

					var eitherCount;
					if (container != null) {
						if (evalCommand.commandType == ControlCommand.CommandType.TurnsSince)
							eitherCount = this.TurnsSinceForContainer(container);
						else
							eitherCount = this.VisitCountForContainer(container);
					} else {
						if (evalCommand.commandType == ControlCommand.CommandType.TurnsSince)
							eitherCount = -1;
						else
							eitherCount = 0;

						this.Warning("Failed to find container for " + evalCommand.toString() + " lookup at " + divertTarget.targetPath.toString());
					}

					this.state.PushEvaluationStack(new IntValue(eitherCount));
					break;

				case ControlCommand.CommandType.Random:
					var maxInt = this.state.PopEvaluationStack();
					var minInt = this.state.PopEvaluationStack();

					if (minInt == null || minInt instanceof IntValue === false)
						this.Error("Invalid value for minimum parameter of RANDOM(min, max)");

					if (maxInt == null || minInt instanceof IntValue === false)
						this.Error("Invalid value for maximum parameter of RANDOM(min, max)");

					// +1 because it's inclusive of min and max, for e.g. RANDOM(1,6) for a dice roll.
					var randomRange = maxInt.value - minInt.value + 1;
					if (randomRange <= 0)
						this.Error("RANDOM was called with minimum as " + minInt.value + " and maximum as " + maxInt.value + ". The maximum must be larger");

					var resultSeed = this.state.storySeed + this.state.previousRandom;
					var random = new PRNG(resultSeed);

					var nextRandom = random.next();
					var chosenValue = (nextRandom % randomRange) + minInt.value;
					this.state.PushEvaluationStack(new IntValue(chosenValue));

					// Next random number (rather than keeping the Random object around)
					this.state.previousRandom = nextRandom;
					break;

				case ControlCommand.CommandType.SeedRandom:
					var seed = this.state.PopEvaluationStack();
					if (seed == null || seed instanceof IntValue === false)
						this.Error("Invalid value passed to SEED_RANDOM");

					// Story seed affects both RANDOM and shuffle behaviour
					this.state.storySeed = seed.value;
					this.state.previousRandom = 0;

					// SEED_RANDOM returns nothing.
					this.state.PushEvaluationStack(new Void());
					break;

				case ControlCommand.CommandType.VisitIndex:
					var count = this.VisitCountForContainer(this.state.currentPointer.container) - 1; // index not count
					this.state.PushEvaluationStack(new IntValue(count));
					break;

				case ControlCommand.CommandType.SequenceShuffleIndex:
					var shuffleIndex = this.NextSequenceShuffleIndex();
					this.state.PushEvaluationStack(new IntValue(shuffleIndex));
					break;

				case ControlCommand.CommandType.StartThread:
					// Handled in main step function
					break;

				case ControlCommand.CommandType.Done:
					// We may exist in the context of the initial
					// act of creating the thread, or in the context of
					// evaluating the content.
					if (this.state.callStack.canPopThread) {
						this.state.callStack.PopThread();
					}

					// In normal flow - allow safe exit without warning
					else {
						this.state.didSafeExit = true;

						// Stop flow in current thread
						this.state.currentPointer = Pointer.Null;
					}

					break;

				// Force flow to end completely
				case ControlCommand.CommandType.End:
					this.state.ForceEnd();
					break;

				case ControlCommand.CommandType.ListFromInt:
	//				var intVal = state.PopEvaluationStack () as IntValue;
					var intVal = parseInt(this.state.PopEvaluationStack());
	//				var listNameVal = state.PopEvaluationStack () as StringValue;
					var listNameVal = this.state.PopEvaluationStack().toString();

					if (intVal == null) {
					throw new StoryException("Passed non-integer when creating a list element from a numerical value.");
					}

					var generatedListValue = null;

					var foundListDef;
					if (foundListDef = this.listDefinitions.TryListGetDefinition(listNameVal, foundListDef)) {
						var foundItem = foundListDef.TryGetItemWithValue(intVal);
						if (foundItem.exists) {
							generatedListValue = new ListValue(foundItem.item, intVal);
						}
					} else {
						throw new StoryException("Failed to find LIST called " + listNameVal.value);
					}

					if (generatedListValue == null)
						generatedListValue = new ListValue();

					this.state.PushEvaluationStack(generatedListValue);
					break;

				case ControlCommand.CommandType.ListRange:
					var max = this.state.PopEvaluationStack();
					var min = this.state.PopEvaluationStack();

	//				var targetList = state.PopEvaluationStack () as ListValue;
					var targetList = this.state.PopEvaluationStack();

					if (targetList instanceof ListValue === false || targetList == null || min == null || max == null)
						throw new StoryException("Expected list, minimum and maximum for LIST_RANGE");

					// Allow either int or a particular list item to be passed for the bounds,
					// so wrap up a function to handle this casting for us.
					var IntBound = function IntBound(obj){
	//					var listValue = obj as ListValue;
						var listValue = obj;
						if (listValue instanceof ListValue) {
							return parseInt(listValue.value.maxItem.Value);
						}

	//					var intValue = obj as IntValue;
						var intValue = obj;
						if (intValue instanceof IntValue) {
							return intValue.value;
						}

						return -1;
					};

					var minVal = IntBound(min);
					var maxVal = IntBound(max);
					if (minVal == -1)
						throw new StoryException("Invalid min range bound passed to LIST_VALUE(): " + min);

					if (maxVal == -1)
						throw new StoryException("Invalid max range bound passed to LIST_VALUE(): " + max);

					// Extract the range of items from the origin list
					var result = new ListValue();
					var origins = targetList.value.origins;

					if (origins != null) {
						origins.forEach(function(origin){
							var rangeFromOrigin = origin.ListRange(minVal, maxVal);
							rangeFromOrigin.value.forEach(function(kv){
								result.value.Add(kv.Key, kv.Value);
							});
						});
					}

					this.state.PushEvaluationStack(result);
					break;

				default:
					this.Error("unhandled ControlCommand: " + evalCommand);
					break;
				}

				return true;
			}

			// Variable assignment
			else if( contentObj instanceof VariableAssignment ) {
				var varAss = contentObj;
				var assignedVal = this.state.PopEvaluationStack();

				// When in temporary evaluation, don't create new variables purely within
				// the temporary context, but attempt to create them globally
				//var prioritiseHigherInCallStack = _temporaryEvaluationContainer != null;

				this.state.variablesState.Assign(varAss, assignedVal);

				return true;
			}

			// Variable reference
			else if( contentObj instanceof VariableReference ) {
				var varRef = contentObj;
				var foundValue = null;


				// Explicit read count value
				if (varRef.pathForCount != null) {

					var container = varRef.containerForCount;
					var count = this.VisitCountForContainer(container);
					foundValue = new IntValue(count);
				}

				// Normal variable reference
				else {

					foundValue = this.state.variablesState.GetVariableWithName(varRef.name);

					if (foundValue == null) {
						var defaultVal = this.state.variablesState.TryGetDefaultVariableValue (varRef.name);
						if (defaultVal != null) {
							this.Warning("Variable not found in save state: '" + varRef.name + "', but seems to have been newly created. Assigning value from latest ink's declaration: " + defaultVal);
							foundValue = defaultVal;

							// Save for future usage, preventing future errors
							// Only do this for variables that are known to be globals, not those that may be missing temps.
							state.variablesState.SetGlobal(varRef.name, foundValue);
						} else {
							this.Warning ("Variable not found: '" + varRef.name + "'. Using default value of 0 (false). This can happen with temporary variables if the declaration hasn't yet been hit.");
							foundValue = new IntValue(0);
						}
					}
				}

				this.state.PushEvaluationStack(foundValue);

				return true;
			}

			// Native function call
			else if (contentObj instanceof NativeFunctionCall) {
				var func = contentObj;
				var funcParams = this.state.PopEvaluationStack(func.numberOfParameters);
				var result = func.Call(funcParams);
				this.state.PushEvaluationStack(result);
				return true;
			}

			// No control content, must be ordinary content
			return false;
		}
		ChoosePathString(path, resetCallstack, args){
			resetCallstack = (typeof resetCallstack !== 'undefined') ? resetCallstack : true;
			args = args || [];

			this.IfAsyncWeCant ("call ChoosePathString right now");

			if (resetCallstack) {
				this.ResetCallstack();
			} else {
				if (this.state.callStack.currentElement.type == PushPopType.Function) {
					var funcDetail = "";
					var container = this.state.callStack.currentElement.currentPointer.container;
					if (container != null) {
						funcDetail = "("+container.path.toString ()+") ";
					}
					throw "Story was running a function "+funcDetail+"when you called ChoosePathString("+path+") - this is almost certainly not not what you want! Full stack trace: \n"+this.state.callStack.callStackTrace;
				}
			}

			this.state.PassArgumentsToEvaluationStack(args);
			this.ChoosePath(new Path$1(path));
		}

		IfAsyncWeCant (activityStr)
		{
			if (this._asyncContinueActive)
				throw "Can't " + activityStr + ". Story is in the middle of a ContinueAsync(). Make more ContinueAsync() calls or a single Continue() call beforehand.";
		}

		ChoosePath(p){
			this.state.SetChosenPath(p);

			// Take a note of newly visited containers for read counts etc
			this.VisitChangedContainersDueToDivert();
		}
		ChooseChoiceIndex(choiceIdx){
			choiceIdx = choiceIdx;
			var choices = this.currentChoices;
			if (choiceIdx < 0 || choiceIdx > choices.length) console.warn("choice out of range");

			// Replace callstack with the one from the thread at the choosing point,
			// so that we can jump into the right place in the flow.
			// This is important in case the flow was forked by a new thread, which
			// can create multiple leading edges for the story, each of
			// which has its own context.
			var choiceToChoose = choices[choiceIdx];
			this.state.callStack.currentThread = choiceToChoose.threadAtGeneration;

			this.ChoosePath(choiceToChoose.targetPath);
		}
		HasFunction(functionName){
			try {
				return this.KnotContainerWithName(functionName) != null;
			} catch(e) {
				return false;
			}
		}
		EvaluateFunction(functionName, args, returnTextOutput){
			//EvaluateFunction behaves slightly differently than the C# version. In C#, you can pass a (second) parameter `out textOutput` to get the text outputted by the function. This is not possible in js. Instead, we maintain the regular signature (functionName, args), plus an optional third parameter returnTextOutput. If set to true, we will return both the textOutput and the returned value, as an object.
			returnTextOutput = !!returnTextOutput;

			this.IfAsyncWeCant("evaluate a function");

			if (functionName == null) {
				throw "Function is null";
			}
			else if (functionName == '' || functionName.trim() == '') {
				throw "Function is empty or white space.";
			}

			var funcContainer = this.KnotContainerWithName(functionName);
			if (funcContainer == null) {
				throw "Function doesn't exist: '" + functionName + "'";
			}

			var outputStreamBefore = [];
			outputStreamBefore.push.apply(outputStreamBefore, this.state.outputStream);
			this._state.ResetOutput();

			this.state.StartFunctionEvaluationFromGame(funcContainer, args);

			// Evaluate the function, and collect the string output
			var stringOutput = new StringBuilder();
			while (this.canContinue) {
				stringOutput.Append(this.Continue());
			}
			var textOutput = stringOutput.toString();

			this._state.ResetOutput(outputStreamBefore);

			var result = this.state.CompleteFunctionEvaluationFromGame();

			return (returnTextOutput) ? {'returned': result, 'output': textOutput} : result;
		}
		EvaluateExpression(exprContainer){
			var startCallStackHeight = this.state.callStack.elements.length;

			this.state.callStack.Push(PushPopType.Tunnel);

			this._temporaryEvaluationContainer = exprContainer;

			this.state.GoToStart();

			var evalStackHeight = this.state.evaluationStack.length;

			this.Continue();

			this._temporaryEvaluationContainer = null;

			// Should have fallen off the end of the Container, which should
			// have auto-popped, but just in case we didn't for some reason,
			// manually pop to restore the state (including currentPath).
			if (this.state.callStack.elements.length > startCallStackHeight) {
				this.state.PopCallStack();
			}

			var endStackHeight = this.state.evaluationStack.length;
			if (endStackHeight > evalStackHeight) {
				return this.state.PopEvaluationStack();
			} else {
				return null;
			}
		}
		CallExternalFunction(funcName, numberOfArguments){
			var func = this._externals[funcName];
			var fallbackFunctionContainer = null;

			var foundExternal = typeof func !== 'undefined';

			// Try to use fallback function?
			if (!foundExternal) {
				if (this.allowExternalFunctionFallbacks) {
	//				fallbackFunctionContainer = ContentAtPath (new Path (funcName)) as Container;
					fallbackFunctionContainer = this.KnotContainerWithName(funcName);
					if (!(fallbackFunctionContainer instanceof Container)) console.warn("Trying to call EXTERNAL function '" + funcName + "' which has not been bound, and fallback ink function could not be found.");

					// Divert direct into fallback function and we're done
					this.state.callStack.Push(
						PushPopType.Function,
						undefined,
						this.state.outputStream.length
					);
					this.state.divertedPointer = Pointer.StartOf(fallbackFunctionContainer);
					return;

				} else {
					console.warn("Trying to call EXTERNAL function '" + funcName + "' which has not been bound (and ink fallbacks disabled).");
				}
			}

			// Pop arguments
			var args = [];
			for (var i = 0; i < numberOfArguments; ++i) {
	//			var poppedObj = state.PopEvaluationStack () as Value;
				var poppedObj = this.state.PopEvaluationStack();
				var valueObj = poppedObj.valueObject;
				args.push(valueObj);
			}

			// Reverse arguments from the order they were popped,
			// so they're the right way round again.
			args.reverse();

			// Run the function!
			var funcResult = func(args);

			// Convert return value (if any) to the a type that the ink engine can use
			var returnObj = null;
			if (funcResult != null) {
				returnObj = Value.Create(funcResult);
				if (returnObj == null) console.warn("Could not create ink value from returned object of type " + (typeof funcResult));
			} else {
				returnObj = new Void();
			}

			this.state.PushEvaluationStack(returnObj);
		}
		TryCoerce(value){
			//we're skipping type coercition in this implementation. First of, js is loosely typed, so it's not that important. Secondly, there is no clean way (AFAIK) for the user to describe what type of parameters he/she expects.
			return value;
		}
		BindExternalFunctionGeneral(funcName, func){
			this.IfAsyncWeCant("bind an external function");
			if (this._externals[funcName]) console.warn("Function '" + funcName + "' has already been bound.");
			this._externals[funcName] = func;
		}
		BindExternalFunction(funcName, func){
			if (!func) console.warn("Can't bind a null function");

			this.BindExternalFunctionGeneral(funcName, (args) => {
				if (args.length < func.length) console.warn("External function expected " + func.length + " arguments");

				var coercedArgs = [];
				for (var i = 0, l = args.length; i < l; i++){
					coercedArgs[i] = this.TryCoerce(args[i]);
				}
				return func.apply(null, coercedArgs);
			});
		}
		UnbindExternalFunction(funcName){
			this.IfAsyncWeCant("unbind an external a function");
			if (typeof this._externals[funcName] === 'undefined') console.warn("Function '" + funcName + "' has not been bound.");
			delete this._externals[funcName];
		}
		ValidateExternalBindings(containerOrObject, missingExternals){
			if (!containerOrObject){
				var missingExternals = [];
				this.ValidateExternalBindings(this._mainContentContainer, missingExternals);
				this._hasValidatedExternals = true;

				// No problem! Validation complete
				if( missingExternals.length == 0 ) {
					this._hasValidatedExternals = true;
				}

				// Error for all missing externals
				else {
					var message = "Error: Missing function binding for external";
					message += (missingExternals.length > 1) ? "s" : "";
					message += ": '";
					message += missingExternals.join("', '");
					message += "' ";
					message += (this.allowExternalFunctionFallbacks) ? ", and no fallback ink function found." : " (ink fallbacks disabled)";

					this.Error(message);
				}
			}
			else if (containerOrObject instanceof Container){
				var c = containerOrObject;

				c.content.forEach(innerContent => {
					if( !(innerContent instanceof Container) || !innerContent.hasValidName ) {
						this.ValidateExternalBindings(innerContent, missingExternals);
					}
				});
				for (var key in c.namedContent){
					this.ValidateExternalBindings(c.namedContent[key], missingExternals);
				}
			}
			else{
				var o = containerOrObject;
				// the following code is already taken care of above in this implementation
				//
				// var container = o as Container;
				// if (container) {
				// 	ValidateExternalBindings (container, missingExternals);
				// 	return;
				// }

				// var divert = o as Divert;
				var divert = o;
				if (divert instanceof Divert && divert.isExternal) {
					var name = divert.targetPathString;

					if (!this._externals[name]) {
						if( this.allowExternalFunctionFallbacks ) {
							var fallbackFound = !!this.mainContentContainer.namedContent[name];
							if( !fallbackFound ) {
								missingExternals.push(name);
							}
						} else {
							missingExternals.push(name);
						}
					}
				}
			}
		}
		ObserveVariable(variableName, observer){
			this.IfAsyncWeCant("observe a new variable");

			if (this._variableObservers == null)
				this._variableObservers = {};

			if(!this.state.variablesState.GlobalVariableExistsWithName(variableName))
				throw new StoryException("Cannot observe variable '"+variableName+"' because it wasn't declared in the ink story.");

			if (this._variableObservers[variableName]) {
				this._variableObservers[variableName].push(observer);
			} else {
				this._variableObservers[variableName] = [observer];
			}
		}
		ObserveVariables(variableNames, observers){
			for (var i = 0, l = variableNames.length; i < l; i++){
				this.ObserveVariable(variableNames[i], observers[i]);
			}
		}
		RemoveVariableObserver(observer, specificVariableName){
			this.IfAsyncWeCant("remove a variable observer");

			if (this._variableObservers == null)
				return;

			// Remove observer for this specific variable
			if (typeof specificVariableName !== 'undefined') {
				if (this._variableObservers[specificVariableName]) {
					this._variableObservers[specificVariableName].splice(this._variableObservers[specificVariableName].indexOf(observer), 1);
				}
			}

			// Remove observer for all variables
			else {
				for (var varName in this._variableObservers){
					this._variableObservers[varName].splice(this._variableObservers[varName].indexOf(observer), 1);
				}
			}
		}
		VariableStateDidChangeEvent(variableName, newValueObj){
			if (this._variableObservers == null)
				return;

			var observers = this._variableObservers[variableName];
			if (typeof observers !== 'undefined') {

				if (!(newValueObj instanceof Value)) {
					throw "Tried to get the value of a variable that isn't a standard type";
				}
	//			var val = newValueObj as Value;
				var val = newValueObj;

				observers.forEach(function(observer){
					observer(variableName, val.valueObject);
				});
			}
		}
		TagsForContentAtPath(path){
			return this.TagsAtStartOfFlowContainerWithPathString(path);
		}
		TagsAtStartOfFlowContainerWithPathString(pathString){
			var path = new Path$1(pathString);

			// Expected to be global story, knot or stitch
	//		var flowContainer = ContentAtPath (path) as Container;
			var flowContainer = this.ContentAtPath(path).container;
			while(true) {
				var firstContent = flowContainer.content[0];
				if (firstContent instanceof Container)
					flowContainer = firstContent;
				else break;
			}


			// Any initial tag objects count as the "main tags" associated with that story/knot/stitch
			var tags = null;

			flowContainer.content.every(c => {
	//			var tag = c as Runtime.Tag;
				var tag = c;
				if (tag instanceof Tag) {
					if (tags == null) tags = [];
					tags.push(tag.text);
					return true;
				} else return false;
			});

			return tags;
		}
		BuildStringOfHierarchy(){
			var sb = new StringBuilder();

			this.mainContentContainer.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());

	    return sb.toString();
		}
		BuildStringOfContainer(container){
			var sb = new StringBuilder();
			container.BuildStringOfHierarchy(sb, 0, this.state.currentPointer.Resolve());
			return sb.toString();
		}
		NextContent(){
			// Setting previousContentObject is critical for VisitChangedContainersDueToDivert
			this.state.previousPointer = this.state.currentPointer.copy();

			// Divert step?
			if (!this.state.divertedPointer.isNull) {

				this.state.currentPointer = this.state.divertedPointer.copy();
				this.state.divertedPointer = Pointer.Null;

				// Internally uses state.previousContentObject and state.currentContentObject
				this.VisitChangedContainersDueToDivert();

				// Diverted location has valid content?
				if (!this.state.currentPointer.isNull) {
					return;
				}

				// Otherwise, if diverted location doesn't have valid content,
				// drop down and attempt to increment.
				// This can happen if the diverted path is intentionally jumping
				// to the end of a container - e.g. a Conditional that's re-joining
			}

			var successfulPointerIncrement = this.IncrementContentPointer();

			// Ran out of content? Try to auto-exit from a function,
			// or finish evaluating the content of a thread
			if (!successfulPointerIncrement) {

				var didPop = false;

				if (this.state.callStack.CanPop(PushPopType.Function)) {

					// Pop from the call stack
					this.state.PopCallStack(PushPopType.Function);

					// This pop was due to dropping off the end of a function that didn't return anything,
					// so in this case, we make sure that the evaluator has something to chomp on if it needs it
					if (this.state.inExpressionEvaluation) {
						this.state.PushEvaluationStack(new Void());
					}

					didPop = true;
				}

				else if (this.state.callStack.canPopThread) {
					this.state.callStack.PopThread();

					didPop = true;
				}
				else {
					this.state.TryExitFunctionEvaluationFromGame();
				}

				// Step past the point where we last called out
				if (didPop && !this.state.currentPointer.isNull) {
					this.NextContent();
				}
			}
		}
		IncrementContentPointer(){
			var successfulIncrement = true;

			var pointer = this.state.callStack.currentElement.currentPointer.copy();
			pointer.index++;

			// Each time we step off the end, we fall out to the next container, all the
			// while we're in indexed rather than named content
			while (pointer.index >= pointer.container.content.length) {

				successfulIncrement = false;

	//			Container nextAncestor = pointer.container.parent as Container;
				var nextAncestor = pointer.container.parent;
				if (nextAncestor instanceof Container === false) {
					break;
				}

				var indexInAncestor = nextAncestor.content.indexOf(pointer.container);
				if (indexInAncestor == -1) {
					break;
				}

				pointer = new Pointer(nextAncestor, indexInAncestor);

				pointer.index++;

				successfulIncrement = true;
			}

			if (!successfulIncrement) pointer = Pointer.Null;

			this.state.callStack.currentElement.currentPointer = pointer.copy();

			return successfulIncrement;
		}
		TryFollowDefaultInvisibleChoice(){
			var allChoices = this._state.currentChoices;

			// Is a default invisible choice the ONLY choice?
			var invisibleChoices = allChoices.filter(c => {
				return c.isInvisibleDefault;
			});
			if (invisibleChoices.length == 0 || allChoices.length > invisibleChoices.length)
				return false;

			var choice = invisibleChoices[0];

			this.ChoosePath(choice.targetPath);

			return true;
		}
		VisitCountForContainer(container){
			if( !container.visitsShouldBeCounted ) {
				console.warn("Read count for target ("+container.name+" - on "+container.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c).");
				return 0;
			}

			var count = 0;
			var containerPathStr = container.path.toString();
			count = this.state.visitCounts[containerPathStr] || count;
			return count;
		}
		IncrementVisitCountForContainer(container){
			var count = 0;
			var containerPathStr = container.path.toString();
			if (this.state.visitCounts[containerPathStr]) count = this.state.visitCounts[containerPathStr];
			count++;
			this.state.visitCounts[containerPathStr] = count;
		}
		RecordTurnIndexVisitToContainer(container){
			var containerPathStr = container.path.toString();
			this.state.turnIndices[containerPathStr] = this.state.currentTurnIndex;
		}
		TurnsSinceForContainer(container){
			if( !container.turnIndexShouldBeCounted ) {
				this.Error("TURNS_SINCE() for target ("+container.name+" - on "+container.debugMetadata+") unknown. The story may need to be compiled with countAllVisits flag (-c).");
			}

			var containerPathStr = container.path.toString();
			var index = this.state.turnIndices[containerPathStr];
			if (typeof index !== 'undefined') {
				return this.state.currentTurnIndex - index;
			} else {
				return -1;
			}
		}
		NextSequenceShuffleIndex(){
	//		var numElementsIntVal = state.PopEvaluationStack () as IntValue;
			var numElementsIntVal = this.state.PopEvaluationStack();
			if (!(numElementsIntVal instanceof IntValue)) {
				this.Error("expected number of elements in sequence for shuffle index");
				return 0;
			}

			var seqContainer = this.state.currentPointer.container;

			var numElements = numElementsIntVal.value;

	//		var seqCountVal = state.PopEvaluationStack () as IntValue;
			var seqCountVal = this.state.PopEvaluationStack();
			var seqCount = seqCountVal.value;
			var loopIndex = seqCount / numElements;
			var iterationIndex = seqCount % numElements;

			// Generate the same shuffle based on:
			//  - The hash of this container, to make sure it's consistent
			//    each time the runtime returns to the sequence
			//  - How many times the runtime has looped around this full shuffle
			var seqPathStr = seqContainer.path.toString();
			var sequenceHash = 0;
			for (var i = 0, l = seqPathStr.length; i < l; i++){
				sequenceHash += seqPathStr.charCodeAt(i) || 0;
			}
			var randomSeed = sequenceHash + loopIndex + this.state.storySeed;
			var random = new PRNG(parseInt(randomSeed));

			var unpickedIndices = [];
			for (var i = 0; i < numElements; ++i) {
				unpickedIndices.push(i);
			}

			for (var i = 0; i <= iterationIndex; ++i) {
				var chosen = random.next() % unpickedIndices.length;
				var chosenIndex = unpickedIndices[chosen];
				unpickedIndices.splice(chosen, 1);

				if (i == iterationIndex) {
					return chosenIndex;
				}
			}

			throw "Should never reach here";
		}
		Error(message, useEndLineNumber){
			var e = new StoryException(message);
	//		e.useEndLineNumber = useEndLineNumber;
			throw e;
		}
		Warning(message){
			this.AddError(message, true);
		}
		AddError(message, isWarning, useEndLineNumber){

			var errorTypeStr = isWarning ? "WARNING" : "ERROR";

			if(!this.state.currentPointer.isNull) {
				message = "RUNTIME " + errorTypeStr + ": (" + this.state.currentPath + "): " + message;
			}
			else {
				message = "RUNTIME " + errorTypeStr + ": " + message;
			}

			this.state.AddError(message, isWarning);

			// In a broken state don't need to know about any other errors.
			if (!isWarning)
				this.state.ForceEnd();
		}
	}

	var OutputStateChange = {
		NoChange: 0,
		ExtendedBeyondNewline: 1,
		NewlineRemoved: 2
	};

	exports.Story = Story;
	exports.InkList = InkList;

	Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* global AFRAME THREE */

const Story = __webpack_require__(0).Story;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const INK_LOADED_EVENT = 'ink-loaded';
const INK_CONTINUE_EVENT = 'ink-continue';
const INK_STATE_VARIABLE_EVENT = 'ink-state-variable';

const STATE_UPDATE_EVENT = 'stateupdate';

AFRAME.registerComponent('ink', {
  schema: {
    src: {
      type: 'asset'
    },
    choice: {
      default: undefined
    },
    sync: {
      type: 'boolean',
      default: false
    }
  },

  multiple: false,

  init: function () {
    this.loader = new THREE.FileLoader();
    const el = this.el;

    this.stateUpdated = this.stateUpdated.bind(this);
    if (this.data.sync) {
      el.addEventListener(STATE_UPDATE_EVENT, this.stateUpdated); 
    }
  },

  update: function (oldData) {
    const data = this.data;
    const el = this.el;
    const stateSystem = el.systems.state;

    if (data.src && data.src !== oldData.src) {
      this.loader.load(data.src, (json) => {
        const story = new Story(json);

        this.inkStory = story;
        var key;
        var inkKey;
        for (key in stateSystem.state) {
          // for 1.8.x
          //for (inkKey of story.variablesState._globalVariables.keys()) {
          for (inkKey in story.variablesState._globalVariables) {
            if (inkKey === key) {
              story.ObserveVariable(inkKey, (varName, newValue) => {
                //console.log('var changed', varName, newValue)
                el.emit(INK_STATE_VARIABLE_EVENT, {
                  [varName]: newValue
                });
              });
            }
          }
        }

        story.ResetState()
        this.continue();

        el.emit(INK_LOADED_EVENT, {
          story: story
        });
      });
    }

    if (this.data.choice && data.choice.index > -1) {
      this.continue(data.choice.index);
    }
  },

  stateUpdated: function (evt) {

    if (!this.inkStory || !this.data.sync) return;

    const state = evt.detail.state;
    var key;
    var inkKey;
    for (key in state) {
      // update ink state
      for (inkKey of this.inkStory.variablesState._globalVariables.keys()) {
        // state variable is also used in ink
        if (inkKey === key) {
          const inkVal = this.inkStory.variablesState[inkKey];
          if (!AFRAME.utils.deepEqual(inkVal, state[key])) {
            this.inkStory.variablesState[inkKey] = state[key];
          }
        }
      }
    }
  },

  remove: function () {
    if (this.data.sync) {
      this.el.removeEventListener(STATE_UPDATE_EVENT, this.stateUpdated); 
    }
  },

  continue: function (choice = -1) {
    // if (!this.inkStory) return;

    if (choice > -1) {
      this.inkStory.ChooseChoiceIndex(choice);
    }

    while (this.inkStory.canContinue) {
      this.inkStory.Continue();

      const choices = this.inkStory.currentChoices.map(c => {
        return {
          index: c.index,
          text: c.text
        };
      });

      const detail = {
        text: this.inkStory.currentText,
        tags: this.inkStory.currentTags,
        choices: choices
      }
      this.el.emit(INK_CONTINUE_EVENT, detail);
    }
  }

});


/***/ })
/******/ ]);