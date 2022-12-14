import React, {useCallback, useState, useEffect} from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native'

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container, 
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton
     } from './styles';

export interface DataListProps extends TransactionCardProps  {
    id: string;
}

interface HighlightProps {
    amount: string;

}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
   const [transactions, setTransactions] = useState<DataListProps[]>([]);//estado armazena array de dados em forma de string
   const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)


    async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);//pega dados de dataKey
    const transactions = response ? JSON.parse(response) : [];//se response existe retorna JSON.parse()

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions//formata as transações
        .map((item: DataListProps) =>{//map pega cada item e formata em string(DataListProps)

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount)
            }else{
                expensiveTotal
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {//os itens amount serão números/pt-BR/moeda/Brasil
                style: 'currency',
                currency: 'BRL'
            });
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));//data será formatada de acordo com date

            return { 
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(transactionsFormatted);

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency', 
                    currency: 'BRL'})
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency', 
                    currency: 'BRL'})
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency', 
                    currency: 'BRL'})
            }
        })
        console.log(transactionsFormatted)
   }


   useEffect(() => {
        loadTransactions();

   }, []);


   useFocusEffect(useCallback(() => {
        loadTransactions();
   }, []));
    

    return(
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{
                            uri: 'https://avatars.githubusercontent.com/u/56439984?v=4'}}
                            />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Isaac</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>

                </UserWrapper>

            </Header>
            
            <HighlightCards>
                <HighlightCard 
                    type="up"
                    title="Entradas" 
                    amount={highlightData.entries.amount}
                    lastTransaction="Última entrada dia 13 de abril"/>

            <HighlightCard 
                    type="down"
                    title="Saídas" 
                    amount={highlightData.expensives.amount}
                    lastTransaction="Última saída dia 03 de abril"/>

            <HighlightCard 
                    type="total"
                    title="Total" 
                    amount={highlightData.total.amount}
                    lastTransaction="01 à 16 de abril"/>
          
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>

                <TransactionList 
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                    />            
            </Transactions>
        </Container>
    )
}
