// Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки. Придумать шаблон, который заменяет одинарные кавычки на двойные. Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.

const text = `Anton sat up unusually straight and said loudly and clearly (although he knew almost no German): Ich sterbe ('I'm dying'). The doctor calmed him, took a syringe, gave him an injection of camphor, and ordered champagne. Anton took a full glass, examined it, smiled at me and said: 'It's a long time since I drank champagne.' He drained it and lay quietly on his left side, and I just had time to run to him and lean across the bed and call to him, but he had stopped breathing and was sleeping peacefully as a child ...

Muhammad Ali said: 'Often it isn't the mountains ahead that wear you out, it's the little pebble in your shoe.'

Boris Becker said: 'I can't change history, I don't want to change history.I can only change the future.I'm working on that.'

Henry Ford said: 'We don't want tradition. We want to live in the present and the only history that is worth a tinker's damn is the history we make today.'

Somebody said: 'They're working on it'`

let regexp = /(?<=\W)'(?=\w)|(?<=.)'(?=\W)/gim
let regExp = new RegExp(`(?<=\\W)'(?=\\w)|(?<=.)'(?=\\W)`, `gim`)


console.log(text.replace(regexp, `"`))