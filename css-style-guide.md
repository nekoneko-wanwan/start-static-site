[TOC]

#個人的CSSスタイルガイド案
create: 2014/07/04
update: 2014/08/27


##全体のファイル構成
    -root/
        ├ _src/scss                //開発用
        └ deploy/common/css/*.css  //コンパイルされたcss


##SMACSSとBEMを基本コンセプトとする
###開発用ファイル構成
    -scss/
        ├ foundation/  //プロジェクトの基本的な設定やベースとなる下地をまとめたもの
        │      ├ _compass_prefix.scss   //compassでのprefix設定
        │      ├ _setting.scss          //グローバル変数を設定
        │      ├ _abstract.scss         //グローバル関数・mixinを設定
        │      └ _base.scss             //主に要素セレクタに対する設定
        │
        ├ project/     //プロジェクトで使用するもの
        │      ├ _layout.scss           //レイアウト（ユニークなもの）に対する設定 ※Blockの接頭辞にl-を付与
        │      └ _module.scss           //プロジェクト固有の汎用モジュール ※Blockの接頭辞にm-を付与
        │
        ├ component/   //プロジェクトに関係なく再利用できる汎用性の高いパターン
        │      ├ _utility-module.scss   //汎用的に使い回すモジュール ※Blockの接頭辞にu-を付与
        │      └ _utility-single.scss   //汎用的に使い回す単体class  ※Blockの接頭辞にu-を付与
        │
        ├ style.scss   //各スタイルを一括import
        └ *.scss       //特定のページで使うスタイル ex) -> top.scss

####補足
* reset.cssはcompass/resetを使用
* 特定のページで使うscssには接頭辞は不要
* モジュール化の目安
    * 別ページで似たコードが _3回_ 以上存在したら、_module.scssを要検討
* 汎用的単体classを _3つ_ 以上htmlタグに付与する場合は、モジュール化を要検討


##命名ルール
###IDの使用
* 「IDは機能」「CSSは装飾」と明確用途に分けるため、ページ内リンク / jsフックでのみ使用する
* 実質ユニークなものである_layoutでもIDは避ける(接頭辞にl-を付与することで衝突を避ける)


###BEM的
* Block、Element、Modifier
    * *ModifierとはBlockまたはElementのバリエーション違いの要素のこと
* Elementはアンダースコア2つ *__* でつなぐ
* Modifierは *is-*、もしくは*has-*を接頭辞としたマルチクラス方式を採用する
* 単語の区切りは キャメルケース でつなぐ
* ex) searchBox > searchBox.is-vertical , searchBox__block


###Elementが入れ子になった場合
* 階層化が明確ではなくなるが、可読性を確保するために命名上はエレメントは並列にすることとする
* ex) itemをBlock, boxとheadをElementとした場合
* item\__box\__head (これは避ける)
* item\__head (こっちを利用)


###要素セレクタでの指定
* そのBlock内にて必ず特定のタグ自体が使用される場合は、classを省略しても良いとする
* li, img, input...など



##実際のscssファイルへの記述方法
### Elementをnestさせないでそのまま並列に記述する
    .block {
    }
    .block__element {
      &.is-modifier {  //Element自身のModifier
      }
      .is-modifier & { //BlockのModifierによるElementの変化
      }
    }
* BlockのModifierに対してElementに変化がある場合に親参照ができなく記述が増えてしまうため
* cssも要素セレクタや擬似要素を除き、必要以上の階層化は避ける




##その他検討事項
* プロパティの並び順はabcアルファベット順にするかどうか
* prefixにはどう対応するか
    * grunt-autoprefixer || compassモジュールを使用




