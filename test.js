//@include './dist/index.js'
var $accessValidator = new $FSAccessValidator();

$accessValidator.conditionWithPalette(main, {
    toolName: 'Tool Name',
});

function main() {
    alert('Access granted!');
}
