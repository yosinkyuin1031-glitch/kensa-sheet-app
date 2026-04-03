# カラダマップ プロジェクト情報

## セキュリティ設定

### RLS・Policy設定
新しいテーブルを作成したら必ず以下を実行すること：

1. RLS有効化
ALTER TABLE [テーブル名] ENABLE ROW LEVEL SECURITY;

2. 自院データのみアクセス可能にする場合
CREATE POLICY "clinic_[テーブル名]_policy" ON [テーブル名]
  FOR ALL USING (clinic_id IN (
    SELECT clinic_id FROM clinic_members
    WHERE user_id = auth.uid()
  ));

3. ログインユーザーのみアクセス可能にする場合
CREATE POLICY "authenticated_users_only" ON [テーブル名]
  FOR ALL USING (auth.uid() IS NOT NULL);

### テンプレートファイル
supabase/migrations/20260402_rls_policies.sql に設定済みのSQLあり

## 技術スタック
- 静的HTML + JS構成
- js/ css/ api/ ディレクトリ構成
- Supabase認証（メール・パスワード）
- デプロイ先：Vercel or Netlify

## 注意事項
- .env と .env.local は .gitignore に追加済み
- service_roleキーはコードに含めない
- キャメルケースのカラム名はダブルクォートで囲む（例："clinicId"）
