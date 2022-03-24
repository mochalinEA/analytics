# Универсальная аналитика

## Быстрый старт
`yarn install`: установить зависимости

`yarn build`: собрать ts / js / types

`yarn release`: опубликовать пакет с авто генерацией ченджгов и публикацией в местные репозитории 

## Немного о проекте

### Цель
Единый источник правды, мы поддерживаем все события и системы аналитики, которые используются в этом проекте и только их.

1. Аналитики хранят все свои события в своём репозитории в yaml файлах.
2. Настроен CI, что при каждом релизе из yaml файлов генерируются события для этого репозитория.
3. Рядовые фронты подключают либу и используют только те события которые в ней есть, подключая нужные для конкретного проекта системы аналитики.

### Как использовать
1. подключить
```typescript
import { init } from 'analytics'
import createFBAdapter from 'analytics/adapters/facebook'
import createGAAdapter from 'analytics/adapters/ga'
```

2. инициализировать однажды
```typescript
init({
  adapters: [
    createFBAdapter('fb111'),
    createGAAdapter('ga111', {
      dimensions: {
        dimension1: '{{user_id}}',
      },
    })
  ]
})
```

3. отправлять события, там где это удобно
```typescript jsx
import { pushEvent } from 'analytics'
import eventParterSuccess from 'analytics/events/firstProject/DefaultPartner/appSuccess'
import eventMainSiteSuccess from 'analytics/events/firstProject/MainSiteForm/appSuccess'


export const SomeForm: FC = () => {
  const handleSubmit = () => {
    // sendForm .... axios.post('bla bla bla')

    // new
    pushEvent(eventParterSuccess({ requestId: 123123, label: 'one' }))
    pushEvent(eventMainSiteSuccess({ requestId: 123123 }))

    // old
    pushGtmEvent('default partner', 'appSuccess')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" />
      <input type="text" name="surname" />

      <button type="submit">Да, это я</button>
    </form>
  )
}
```

### Как работает под капотом?
Есть основная либа, которая подключает адаптеры и отправляет события.

Для каждой системы аналитики используется свой адаптер, он реализует три метода:
1. init - инициализация данной аналитики
2. pushEvent - отправка события в данную аналитику
3. setUserId - установка id пользователя (опционально)

При старте проекта иницилизируются все адаптеры.
Есть возможность использовать ленивую инициализацию, например так:
```typescript
createGtagAdapter('gtag111', { lazy: true })
```
в таком случае, код аналитики не подгрузится при первичной инициализации, он подргрузится при первой попытке отправить событие или установить userId.

### semantic-release

#### FAQ

##### Debug
Чтобы запустить в debug режиме нужно сделать `semantic-release --debug`

##### Почему не публикует релизы?
semantic-release обновляет версию в package.json и changelog, только когда запущен на CI, это сделано специально, разработчиками пакета

Если осознанно принято решение релизить из локальной версии, можно добавить в .releaserc "ci": false
