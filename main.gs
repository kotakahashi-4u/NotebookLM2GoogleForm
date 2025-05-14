function makeForm() {
  // 名称：理解度テストでフォームを作成
  // コンテナバインドされたスプレッドシートにアクセスし、データ全体を取得
  const form = FormApp.create("理解度テスト", true),
        spreadVals = SpreadsheetApp.getActive().getActiveSheet().getDataRange().getValues();
  
  // フォームをクイズモード、かつ質問の順序をランダムに
  form.setIsQuiz(true)
      .setShuffleQuestions(true);
      
  // スプレッドシートから取得したデータのヘッダー行は使用しないため、shift関数で削除
  spreadVals.shift();
  
  // ヘッダー行を除く全データをループ
  spreadVals.forEach(function(v){
    const question = form.addMultipleChoiceItem().setTitle(v[0]).setRequired(true),   // ラジオボタンを必須回答項目として作成
          answerLst = v[1].split('<br>'),                                             // 回答の選択肢を<br>で分割（今後NotebookLMの返却する回答によっては変更）
          choiceLst = new Array(),                                                    // 選択肢リストの器を作成
          feedback = FormApp.createFeedback().setText(v[3]).build();                  // フィードバックオブジェクトを作成
    // <br>で分割した選択肢リストをループし、各選択肢オブジェクトを作成
    answerLst.forEach(function(a, aIdx){
      choiceLst.push(question.createChoice(a, Number(v[2])-1==aIdx ? true : false));  // 正答である選択肢であれば、trueで選択肢を作成
    });
    
    // 質問項目に選択肢およびフィードバックをセット
    question.setChoices(choiceLst);
    question.setFeedbackForCorrect(feedback)
            .setFeedbackForIncorrect(feedback);
  });

  // 最後に回答用のリンクを取得
  console.log(form.getPublishedUrl());
}
